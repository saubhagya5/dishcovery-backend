import { Router } from 'express';
import {createComment} from '../controllers/commentController';

const router = Router();

// Route for creating a comment
router.post('/comments', createComment); // Adjust the route as needed

export default router;
