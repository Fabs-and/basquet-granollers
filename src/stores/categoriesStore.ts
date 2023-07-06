import { atom } from 'nanostores';
import type { Category } from '../types';

export const allCategories = atom<Category[]>([]);
