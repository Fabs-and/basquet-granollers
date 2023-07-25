import { CategoryFields, PageFields, PostFields } from 'fetch-wordpress-api';

export const postFields: PostFields[] = [
  'title',
  'content',
  'excerpt',
  'link',
  'slug',
  'categories',
  'date',
];

export const categoryFields = [
  'id',
  'name',
  'slug',
];

export const pageFields = [
  'title',
  'content',
]

