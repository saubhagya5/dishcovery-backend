import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Ingredient } from './Ingredient';
import { User } from './User'; // Import the User entity
import { Comment } from './Comment'; // Import the Comment entity
import { Like } from './Like'; // Import the Like entity

@Entity('Recipe')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // Definite assignment assertion

  @Column()
  title: string = ''; // Default value

  @Column('text')
  description: string = ''; // Default value

  @Column('text')
  steps: string = ''; // Default value

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, { cascade: true })
  ingredients!: Ingredient[]; // Reference to associated ingredients

  @ManyToOne(() => User, (user) => user.recipes)
  user!: User; // Reference to the user who created the recipe

  @OneToMany(() => Comment, (comment) => comment.recipe, { cascade: true }) // Define one-to-many relationship with Comment
  comments!: Comment[]; // Reference to associated comments

  @OneToMany(() => Like, (like) => like.recipe, { cascade: true }) // Define one-to-many relationship with Like
  likes!: Like[]; // Reference to associated likes

  @CreateDateColumn()
  created_at: Date = new Date(); // Default value

  @UpdateDateColumn()
  updated_at: Date = new Date(); // Default value
}
