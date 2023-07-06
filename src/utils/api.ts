// import TS types
import { allCategories } from 'src/stores/categoriesStore';
import type { PostFields, CategoryFields, PostParams } from '../types';
import { Endpoints } from '../types';

// Import env variables
const API_URL = import.meta.env.API_URL;

// Gets post by API URL and given path
// If no arguments in getPosts, it retrieves all fields of all posts
export async function getFromAPI(
  endpoint: Endpoints,
  fields?: PostFields[] | CategoryFields[],
  quantity: number = -1,
  category: number = -1,
  slug?: string
) {
  const endpointParams: PostParams = {};

  // Check passed arguments
  if (typeof fields !== 'undefined' && fields.length > 0)
    endpointParams._fields = fields.join(',');
  if (quantity !== -1) endpointParams.per_page = quantity;
  if (category !== -1) endpointParams.categories = category;
  if (slug) endpointParams.slug = slug;

  // create an empty URLSearchParams object
  const query = new URLSearchParams();

  // loop through the endpointParams object and append each key-value pair to the query
  for (const [key, value] of Object.entries(endpointParams)) {
    query.append(key, value as string);
  }

  const posts = await getCall(endpoint, query);

  // if getFromAPI is used to retrieve categories, save it in a global store
  if (endpoint === 'categories') allCategories.set(posts)
  return posts;
}

export async function getPostBySlug(slug: string) {
  const query = new URLSearchParams();

  query.append('slug', slug);

  const post = await getCall(Endpoints.posts, query);

  return post;
}

async function getCall(endpoint: Endpoints, query?: URLSearchParams) {
  try {
    // append the query parameter to the URL
    const url = new URL(`${API_URL}/${endpoint}`);

    // If no query it returns everything in the endpoint by default
    if (query) url.search = query.toString();

    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error in getCall:', error);
  }
}


