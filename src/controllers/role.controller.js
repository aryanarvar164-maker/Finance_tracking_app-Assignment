import { asynchandler } from '../utils/asynchandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Role } from '../models/Role.models.js';

const seedRoles = asynchandler(async (req, res) => {

    const rolesToSeed = [
        {
            name: 'admin',
            can_view: true,
            can_view_record: true,
            can_create: true,
            can_update: true,
            can_delete: true,
            can_manage_user: true
        },
        {
            name: 'analyst',
            can_view: true,
            can_view_record: true,
            can_create: false,
            can_update: false,
            can_delete: false,
            can_manage_user: false
        },
        {
            name: 'viewer',
            can_view: true,
            can_view_record: false,
            can_create: false,
            can_update: false,
            can_delete: false,
            can_manage_user: false
        }
    ];

    await Role.deleteMany({});
    await Role.insertMany(rolesToSeed);

    return res.status(200).json(
        new ApiResponse(200, null, "roles seeded successfully!!!")
    );
});

export { seedRoles };
