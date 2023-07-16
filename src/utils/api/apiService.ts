// Import env variables
const DOMAIN = import.meta.env.DOMAIN;
const WP_API = import.meta.env.WP_API;

// Import Api helper functions
import {
  detectRedirects,
  endpointParamsBuilder,
  queryBuilder,
} from '@utils/api/apiHelperFunctions';

// import TS types
import type { CategoryFields, Post, PageFields } from '../../types';
import { Endpoints, PostFields } from '../../types';


export async function fetchData(endpoint: Endpoints, query?: URLSearchParams) {
  try {
    const url = new URL(`${DOMAIN}${WP_API}/${endpoint}`);
    
    if (query) url.search = query.toString();

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error in fetchData: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    return data;
  } catch (error) {
    console.error('Error in fetchData:', error);
    throw error; // Propagate the error to the caller
  }
}

// #### POSTS ####

export async function fetchAllPosts(
  quantity?: number,
  postFields?: PostFields[]
) {
  if (typeof postFields === 'undefined' && !quantity)
    return await fetchData(Endpoints.posts);

  const endpointParams = endpointParamsBuilder(postFields, quantity);

  const data = await fetchData(Endpoints.posts, queryBuilder(endpointParams));
  const posts: Post[] = await detectRedirects(data);

  return posts;
}

export async function fetchPostsInCategory(
  categoryId: number,
  postFields?: PostFields[],
  quantity?: number
) {
  const endpointParams = endpointParamsBuilder(postFields, quantity);

  endpointParams.categories = categoryId;

  return await fetchData(Endpoints.posts, queryBuilder(endpointParams));
}

export async function fetchPostBySlug(slug: string, postFields?: PostFields[]) {
  const endpointParams = endpointParamsBuilder(postFields);

  endpointParams.slug = slug;

  const post = await fetchData(Endpoints.posts, queryBuilder(endpointParams));

  return post;
}

// #### CATEGORIES ####

export async function fetchAllCategories(categoryFields?: CategoryFields[]) {
  if (typeof categoryFields === 'undefined')
    return await fetchData(Endpoints.categories);

  const endpointParams = endpointParamsBuilder(categoryFields);

  return await fetchData(Endpoints.categories, queryBuilder(endpointParams));
}

// #### PAGES ####

export async function fetchPageBySlug(slug: string, pageFields?: PageFields[]) {
  const endpointParams = endpointParamsBuilder(pageFields);

  endpointParams.slug = slug;

  return await fetchData(Endpoints.pages, queryBuilder(endpointParams));
}











