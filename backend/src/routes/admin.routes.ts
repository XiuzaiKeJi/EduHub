import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { PermissionController } from '../controllers/permission.controller';
import { authenticate, checkPermission } from '../middleware/auth.middleware';

const router = Router();
const roleController = new RoleController();
const permissionController = new PermissionController();

// 角色管理路由
router.get('/roles', authenticate, checkPermission('role', 'view'), roleController.getRoles);
router.post('/roles', authenticate, checkPermission('role', 'create'), roleController.createRole);
router.put('/roles/:id', authenticate, checkPermission('role', 'edit'), roleController.updateRole);
router.delete('/roles/:id', authenticate, checkPermission('role', 'delete'), roleController.deleteRole);

// 权限管理路由
router.get('/permissions', authenticate, checkPermission('permission', 'view'), permissionController.getPermissions);
router.post('/permissions', authenticate, checkPermission('permission', 'create'), permissionController.createPermission);
router.put('/permissions/:id', authenticate, checkPermission('permission', 'edit'), permissionController.updatePermission);
router.delete('/permissions/:id', authenticate, checkPermission('permission', 'delete'), permissionController.deletePermission);

export default router; 