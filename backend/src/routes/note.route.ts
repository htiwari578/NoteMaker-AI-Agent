import express from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js';
import { getAllNotes } from '../controllers/note.controllers.js';

const router = express.Router();

router.route('/all-notes').get(verifyJwt, getAllNotes);

export default router;