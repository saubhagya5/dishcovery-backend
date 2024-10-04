import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Recipe } from '../DB/models/Recipe';
import { Ingredient } from '../DB/models/Ingredient';
import { User } from '../DB/models/User'; // Assuming you have a User model
import {Like} from '../DB/models/Like';

export const createRecipe = async (req: Request, res: Response): Promise<any> => {
  const { title, description, steps, ingredients } = req.body;

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    const userRepository = AppDataSource.getRepository(User); // Assuming User repository

    // Hardcoded userId
    const hardcodedUserId = '12345'; // Replace with an actual userId or dynamic value later

    // Validate input data
    if (!title || !description || !steps) {
      return res.status(400).json({ message: 'Title, description, and steps are required.' });
    }

    // Find the user by the hardcoded userId
    const user = await userRepository.findOne({ where: { id: hardcodedUserId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create a new Recipe instance
    const newRecipe = new Recipe();
    newRecipe.title = title;
    newRecipe.description = description;
    newRecipe.steps = steps;
    newRecipe.user = user; // Associate the recipe with the user

    // Create Ingredient instances and associate them with the recipe
    if (ingredients && Array.isArray(ingredients)) {
      newRecipe.ingredients = ingredients.map((ing: { name: string; quantity: number; unit: string }) => {
        const ingredient = new Ingredient();
        ingredient.name = ing.name;
        ingredient.quantity = ing.quantity;
        ingredient.unit = ing.unit;
        return ingredient;
      });
    }

    // Save the recipe along with its ingredients
    const savedRecipe = await recipeRepository.save(newRecipe);

    return res.status(201).json({
      message: 'Recipe created successfully',
      recipe: savedRecipe,
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllRecipes = async (req: Request, res: Response): Promise<any> => {
  const { search } = req.query; // Capture the search term from query parameters

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);

    let recipes;
    if (search) {
      const searchWords = (search as string).split(' ').slice(0, 2); // Split the search term into words and use up to 2 words

      // Search in title and ingredients
      recipes = await recipeRepository
        .createQueryBuilder('recipe')
        .select(['recipe.title', 'recipe.description', 'recipe.imageUrl']) // Select specific fields
        .leftJoinAndSelect('recipe.ingredients', 'ingredient')
        .where('recipe.title ILIKE :search', { search: `%${search}%` })
        .orWhere(
          'ingredient.name ILIKE :ingredientSearch', 
          { ingredientSearch: `%${search}%` }
        )
        .getMany();
    } else {
      // Return all recipes if no search term is provided
      recipes = await recipeRepository
        .createQueryBuilder('recipe')
        .select(['recipe.title', 'recipe.description', 'recipe.imageUrl']) // Select specific fields
        .getMany();
    }

    return res.status(200).json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const getRecipeById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params; // Get the recipe ID from request parameters
  const userId = '1'; // Assuming you have the user ID from the request

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const likeRepository = AppDataSource.getRepository(Like); // Assuming you have a Likes repository

    // Find the recipe by ID, including ingredients and comments
    const recipe = await recipeRepository.findOne({
      where: { id: id }, // Ensure id is a string or convert as needed
      relations: ['ingredients', 'comments', 'comments.user'], // Include ingredients and comments with user
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Count the likes
    const likesCount = await likeRepository.count({
      where: { recipe: { id: id } }, // Use the recipe ID correctly
    });

    // Check if the user has liked the recipe
    const userLiked = await likeRepository.findOne({
      where: { recipe: { id: id }, user: { id: userId } }, // Use user ID
    });

    // Format comments to include the username
    const commentsWithUsernames = recipe.comments.map(comment => ({
      id: comment.id,              // Ensure this matches the Comment entity
      content: comment.content,     // Make sure 'content' matches the property in your Comment entity
      username: comment.user.username, // Access the username from the related user
      created_at: comment.created_at, // Include the created date if necessary
    }));

    // Return the recipe details along with like count, user's like status, and comments
    return res.status(200).json({
      recipe: {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        steps: recipe.steps,
        ingredients: recipe.ingredients,
        created_at: recipe.created_at,
        updated_at: recipe.updated_at,
      },
      likesCount,
      userLiked: !!userLiked, // Convert to boolean
      comments: commentsWithUsernames, // Add formatted comments
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};