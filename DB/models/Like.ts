// DB/models/Like.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Recipe } from './Recipe';
import { User } from './User'; // Import the User entity

@Entity('Like')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // Definite assignment assertion

  @Column()
  userId: string = ''; // The ID of the user who liked the recipe

  @Column()
  recipeId: string = ''; // The ID of the recipe that was liked

  @CreateDateColumn()
  created_at: Date = new Date(); // Timestamp of when the like was created

  // Establishing a many-to-one relationship with the User entity
  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user!: User; // Reference to the associated user

  // Establishing a many-to-one relationship with the Recipe entity
  @ManyToOne(() => Recipe, (recipe) => recipe.likes, { onDelete: 'CASCADE' })
  recipe!: Recipe; // Reference to the associated recipe
}

