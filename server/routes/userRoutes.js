import { Router } from 'express';
import { listUsers, deleteUser } from '../controllers/userController.js';
import { securePrivate } from '../middlewares/secureRoute.js';
import { deleteUserParamValidator, listUsersQueryValidator } from '../validators/userValidators.js';

const router = Router();

router.get('/', ...securePrivate({ roles: ['admin'], validators: listUsersQueryValidator }), listUsers);
router.delete('/:id', ...securePrivate({ roles: ['admin'], validators: deleteUserParamValidator }), deleteUser);

export default router;
