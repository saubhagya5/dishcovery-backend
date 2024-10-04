import { Router } from 'express';
import {createRecipe} from '../controllers/recipeControllers';
import {getAllRecipes} from '../controllers/recipeControllers'; 
import {getRecipeById} from '../controllers/recipeControllers';// Import the getAllRecipes controller

const router = Router();

// Define the route for creating a new recipe
router.post('/', createRecipe);

// Define the route for fetching all recipes (with optional search functionality)
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

export default router;
