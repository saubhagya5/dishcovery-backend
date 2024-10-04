import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Comment } from '../DB/models/Comment'; 
import { Recipe } from '../DB/models/Recipe'; 
import {User} from '../DB/models/User'

export const createComment = async (req: Request, res: Response): Promise<any> => {
  const { recipeId, content } = req.body; // Expecting recipeId and content in the request body
  const userId = '1'; // Replace with actual user ID after implementing authentication

  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const commentRepository = AppDataSource.getRepository(Comment);

    // Check if the recipe exists
    const recipe = await recipeRepository.findOneBy({ id: recipeId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Create a new comment entry
    const newComment = new Comment();
    newComment.content = content; 
    newComment.user = { id: userId } as User; // Set the user who made the comment
    newComment.recipe = recipe; // Link the comment to the recipe

    await commentRepository.save(newComment);

    return res.status(201).json({ message: 'Comment created successfully.', comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default createComment;
