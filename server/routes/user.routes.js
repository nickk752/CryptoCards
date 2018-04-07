import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
const router = new Router();

router.route('/users').get(UserController.getUsers);

// Get one User by cuid
router.route('/users/:cuid').get(UserController.getUser);

router.route('/users/authenticate').post(UserController.authenticateUser);

// Add a new User
router.route('/users/register').post(UserController.addUser);

// Delete a User by cuid
router.route('/users/:cuid').delete(UserController.deleteUser);

export default router;
