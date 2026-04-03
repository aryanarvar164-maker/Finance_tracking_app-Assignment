import { Router } from 'express';
import {
    createRecord,
    updateRecord,
    deleteRecords,
    getRecord
} from '../controllers/finance.controller.js';
import { verifyJWT } from '../middleware/auth.middlewares.js';
import { attachRoles, checkPermission } from '../middleware/rbac.middlewares.js';

const router = Router();

router.use(verifyJWT);
router.use(attachRoles);

router.route("/").post(checkPermission('can_create'), createRecord).get(checkPermission('can_view_record'), getRecord);

router.route("/:id").put(checkPermission('can_update'), updateRecord).delete(checkPermission('can_delete'), deleteRecords);

export default router;
