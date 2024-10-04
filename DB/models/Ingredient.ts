// DB/models/Ingredient.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Recipe } from './Recipe';

@Entity('Ingredient')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // Definite assignment assertion

  @Column()
  name: string = ''; // Default value

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
  recipe!: Recipe; // Definite assignment assertion

  @Column()
  quantity: number = 0; // Default value

  @Column()
  unit: string = ''; // Default value
}
