import express from 'express';
import { create, fetch, update } from '../controllers/notification.controller.js';

const router = express.Router();

//Routes

router.post('/', create);
router.put('/', update);
router.get('/:id', fetch);

export default router;