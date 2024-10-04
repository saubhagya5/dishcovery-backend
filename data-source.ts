import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Import models
import {User} from './DB/models/User';
import {Recipe} from './DB/models/Recipe';
import {Ingredient} from './DB/models/Ingredient';
import {Like} from './DB/models/Like';
import {Comment} from './DB/models/Comment';

// Load environment variables from .env
dotenv.config();

// Create the data source
export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL, // Use the DATABASE_URL environment variable
    ssl: { rejectUnauthorized: false }, // For CockroachDB/PostgreSQL SSL connection (remove in local dev if not using SSL)
    entities: [User, Recipe, Ingredient, Like, Comment],
    synchronize: false, // Set to false in production; use migrations instead
});

// Initialize the data source
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err: any) => {
        console.error('Error during Data Source initialization', err);
    });
