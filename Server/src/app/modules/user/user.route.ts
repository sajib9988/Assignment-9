import express from 'express';

import { createUserSchema } from './user.validation';
import Validator from '../../middleware/validator';
import { userController } from './user.controller';

const router = express.Router();

router.post('/', Validator(createUserSchema), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);    
router.delete('/:id', userController.deleteUser);
router.get('/:email', userController.findUserByEmail);

export const userRoutes= router;



