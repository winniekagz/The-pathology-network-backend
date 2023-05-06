import {
    createUser,
    updateUser,
    fetchUser,
    fetchUsers,
    _deleteUser,
    createUser as signup,
    login,
    forgotPassword,
    resetpassword,
    activate
} from '../controllers/index.js';

import express from 'express';

const router = express.Router();
//Routes
router.post('/create', createUser);
router.put('/update', updateUser);
router.get('/all', fetchUsers);
router.get('/:id', fetchUser);
router.delete('/:id', _deleteUser);

//Auth
router.post('/register', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetpassword);
router.put('/activate/:activationtoken', activate);

export default router;
