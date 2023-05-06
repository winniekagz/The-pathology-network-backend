import {
    createProject,
    updateProject,
    fetchProject,
    fetchProjects,
    _deleteProject,
    addMember,
} from '../controllers/index.js';

import express from 'express';

import { isAuthenticated } from '../middlewares/auth.js';
import { hasPermissions } from '../middlewares/permissions.js';

const router = express.Router();
//Routes
router.get('/all', fetchProjects);
router.get('/:id', fetchProject);

//Authenticated routes
router.use(isAuthenticated);
router.use(hasPermissions(2)); //2 => admin account 1 normal account

router.post('/create', createProject);
router.put('/update', updateProject);
router.delete('/:id', _deleteProject);
router.put('/add-member', addMember)
export default router;
