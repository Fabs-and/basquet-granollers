import { CategoryFields, PageFields, PostFields } from 'fetch-wordpress-api';

export const postFields = [
  PostFields.title,
  PostFields.content,
  PostFields.excerpt,
  PostFields.link,
  PostFields.slug,
  PostFields.categories,
  PostFields.date,
];

export const categoryFields = [
  CategoryFields.id,
  CategoryFields.name,
  CategoryFields.slug,
];

export const pageFields = [
  PageFields.title,
  PageFields.content,
]

