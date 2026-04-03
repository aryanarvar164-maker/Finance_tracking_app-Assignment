import { asynchandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/User.models.js';
import { Role } from '../models/Role.models.js';

const assignRole = asynchandler(async (req, res) => {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
        throw new ApiError(400, "user or role are not found");
    }

    const role = await Role.findById(roleId);
    if (!role) {
        throw new ApiError(404, "role not found");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { role_id: role._id } },
        { new: true }
    ).select("-password -refreshToken").populate('role_id', 'name');

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "role assigned successfully!!!")
    );
});

const changeUserstatus = asynchandler(async (req, res) => {
    const { userId, status } = req.body; // status is an boolean

    if (userId === undefined || status === undefined) {
        throw new ApiError(400, "user or status are requird");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: { status: Boolean(status) }
        },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, `User status updated successfully to ${status}`)
    );
});

export { assignRole, changeUserstatus };
