import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Like } from '../DB/models/Like'; 
import { Recipe } from '../DB/models/Recipe'; 

export const likeRecipe = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params; 
  const userId = '1'; // Replace with actual user ID after implementing authentication

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const likeRepository = AppDataSource.getRepository(Like);

    // Check if the recipe exists
    const recipe = await recipeRepository.findOneBy({ id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Check if the user has already liked the recipe
    const existingLike = await likeRepository.findOne({
      where: { userId, recipeId: id }
    });

    if (existingLike) {
     
      return res.status(200).json({ 
        message: 'Recipe already liked.', 
        alreadyLiked: true 
      });
    }

    // Create a new like entry
    const newLike = new Like();
    newLike.userId = userId; 
    newLike.recipeId = id; 
    await likeRepository.save(newLike);

    return res.status(201).json({ 
      message: 'Recipe liked successfully.', 
      alreadyLiked: false 
    });
  } catch (error) {
    console.error('Error liking recipe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const unlikeRecipe = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; 
    const userId = '1'; // Replace with actual user ID after implementing authentication
  
    try {
      const likeRepository = AppDataSource.getRepository(Like);
  
      // Check if the user has liked the recipe
      const existingLike = await likeRepository.findOne({
        where: { userId, recipeId: id }
      });
  
      if (!existingLike) {
        return res.status(404).json({ 
          message: 'Like not found. You have not liked this recipe.', 
          alreadyLiked: false 
        });
      }
  
      // Remove the like entry
      await likeRepository.remove(existingLike);
  
      return res.status(200).json({ 
        message: 'Recipe unliked successfully.', 
        alreadyLiked: true 
      });
    } catch (error) {
      console.error('Error unliking recipe:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
