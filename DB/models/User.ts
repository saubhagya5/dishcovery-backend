// DB/models/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Recipe } from './Recipe';
import { Like } from './Like'; // Import the Like entity

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email: string = ''; 

  @Column()
  username: string = '';

  @Column()
  provider: string = '';

  @Column()
  providerId: string = ''; 

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes!: Recipe[];

  @OneToMany(() => Like, (like) => like.user) // Establish the relationship with Like
  likes!: Like[]; // Reference to likes associated with the user

  @CreateDateColumn()
  created_at: Date = new Date();

  @UpdateDateColumn()
  updated_at: Date = new Date();
}

