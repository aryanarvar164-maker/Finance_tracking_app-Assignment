import { Router } from 'express';
import { assignRole, changeUserstatus } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middlewares.js';
import { attachRoles, checkPermission } from '../middleware/rbac.middlewares.js';

const router = Router();

// Protect all routes in this file
router.use(verifyJWT);
router.use(attachRoles);

router.route("/assign-roles").patch(checkPermission('can_manage_user'), assignRole);

router.route("/get-status").patch(checkPermission('can_manage_user'), changeUserstatus);

export default router;
