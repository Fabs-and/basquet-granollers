// import TS types
import type { CategoryFields, PostParams, Post } from '../types';
import { Endpoints, PostFields } from '../types';

// Import env variables
const API_URL = import.meta.env.API_URL;

import { slugExtractor } from '@utils/helperFunctions';
import { postFields } from './apiGlobalParams';

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

  const rawPosts = await getCall(endpoint, query);

  if (endpoint === 'categories') return rawPosts;

  const posts: Post[] = await detectRedirects(rawPosts)
  return posts;
}

export async function getPostBySlug(slug: string) {
  const query = new URLSearchParams();

  query.append('slug', slug);

  const post = await getCall(Endpoints.posts, query);

  return post;
}

export async function getCall(endpoint: Endpoints, query?: URLSearchParams) {
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

export async function detectRedirects(posts: Post[]) {
  const newPosts = await Promise.all(
    posts.map(async (post) => {
      const linkSlug = slugExtractor(post.link as string);
      if (post.slug !== linkSlug) {
        const redirectedPost = await getFromAPI(
          Endpoints.pages,
         postFields,
          -1,
          -1,
          linkSlug
        );

        // If the redirectedPost exists and it's not empty,
        // add the categories from the original post to the redirected post.
        if (redirectedPost && redirectedPost.length > 0) {
          redirectedPost[0] = {
            ...redirectedPost[0],
            categories: post.categories,
          };
        }

        return redirectedPost;
      } else {
        // Ensure to return the original post when the condition does not match.
        // This is required to ensure the same length for newPosts and posts.
        return post;
      }
    })
  );
  // console.log('newPosts', newPosts);
  return newPosts.flat();
}

