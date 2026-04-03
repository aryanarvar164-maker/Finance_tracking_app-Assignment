import { Router } from 'express';
import { getDashboardstats } from '../controllers/dashboard.controller.js';
import { verifyJWT } from '../middleware/auth.middlewares.js';
import { attachRoles, checkPermission } from '../middleware/rbac.middlewares.js';

const router = Router();

router.use(verifyJWT);
router.use(attachRoles);

router.route("/stats").get(checkPermission('can_view'), getDashboardstats);

export default router;
