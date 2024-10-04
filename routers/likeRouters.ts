import { Router } from 'express';
import { likeRecipe, unlikeRecipe } from '../controllers/likeController'; // Import both functions

const router = Router();

// Route for liking a recipe
router.post('/:id/like', likeRecipe); // POST request to like a recipe

// Route for unliking a recipe
router.delete('/:id/unlike', unlikeRecipe); // DELETE request to unlike a recipe

export default router;
