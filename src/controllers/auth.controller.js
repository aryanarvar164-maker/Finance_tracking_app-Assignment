import { asynchandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/User.models.js';
import { Role } from '../models/Role.models.js';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "error while generating refresh and access token");
    }
}

const registerUser = asynchandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required ");
    }

    const existeduser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existeduser) {
        throw new ApiError(400, "email or username already exist");
    }


    const isFirstUser = (await User.countDocuments()) === 0;
    const roleName = isFirstUser ? 'admin' : 'viewer';

    let defaultrole = await Role.findOne({ name: roleName });
    if (!defaultrole) {
        
        throw new ApiError(500, `Role '${roleName}' not found. Please seed roles first.`);
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        role_id: defaultrole._id
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "invalid credentials");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "user registered successfully!!")
    );
});

const loginUser = asynchandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    }).select("+password");

    if (!user) {
        throw new ApiError(404, "user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "false user credentials");
    }

    if (!user.status) {
        throw new ApiError(403, "user account is deactivate");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken").populate('role_id', 'name');

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // secure only in prod
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "user logged in successfully!!"
            )
        );
});

export { registerUser, loginUser };
