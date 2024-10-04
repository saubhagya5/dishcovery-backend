// DB/models/Comment.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Recipe } from './Recipe';

@Entity('Comment')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // Definite assignment assertion

  @Column('text')
  content: string = ''; // Default value

  @ManyToOne(() => User, (user) => user.id) // Reference to the user who made the comment
  user!: User; // Definite assignment assertion

  @ManyToOne(() => Recipe, (recipe) => recipe.id, { onDelete: 'CASCADE' })
  recipe!: Recipe; // Reference to the associated recipe

  @CreateDateColumn()
  created_at: Date = new Date(); // Default value
}

