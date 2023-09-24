import type {
  CategoryFields,
  PageFields,
  PostFields,
} from 'fetch-wordpress-api';

export const postFields: PostFields[] = [
  'title',
  'content',
  'link',
  'slug',
  'categories',
  'date',
];

export const categoryFields: CategoryFields[] = ['id', 'name', 'slug'];

export const pageFields: PageFields[] = ['title', 'content'];

