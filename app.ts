import express from 'express';
import recipeRouter from './routers/recipeRouters'; // Update the import statement to use recipeRouter
import { AppDataSource } from './data-source'; // Ensure this is correctly imported
import likeRouter from './routers/likeRouters';
import commentRoutes from './routers/commentRouter';
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/recipes', recipeRouter); // Use the recipe router for routes starting with /api/recipes
app.use('/recipes', likeRouter);
app.use('/api', commentRoutes);
// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
