import { ApiError } from '../utils/apiError.js';
import { asynchandler } from '../utils/asynchandler.js';
import { Role } from '../models/Role.models.js';

const attachRoles = asynchandler(async (req, _, next) => {

    if (!req.user) {
        throw new ApiError(401, "user not found");
    }

    const role = await Role.findById(req.user.role_id);

    if (!role) {
        throw new ApiError(404, "user role was not found.");
    }

    req.role = role;
    next();
});

const checkPermission = (permission) => {
    return (req, _, next) => {

        if (!req.role) {
            return next(new ApiError(403, "information is missing from request"));
        }

        if (req.role[permission] !== true) {
            return next(new ApiError(403, "permission denied"));
        }

        next();
    };
};

export { attachRoles, checkPermission };
