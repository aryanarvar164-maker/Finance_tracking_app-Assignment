import { Router } from 'express';
import { seedRoles } from '../controllers/role.controller.js';

const router = Router();

router.route("/roles").post(seedRoles);

export default router;
