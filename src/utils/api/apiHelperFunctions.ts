import type { Post, PostParams } from 'src/types';
import { fetchPageBySlug } from './apiService';

export function endpointParamsBuilder(
  fields?: string[],
  quantity?: number
): PostParams {
  const endpointParams: PostParams = {};

  if (Array.isArray(fields) && fields.length > 0) {
    endpointParams._fields = fields.join(',');
  }
  if (typeof quantity === 'number') {
    endpointParams.per_page = quantity;
  }

  return endpointParams;
}

export function queryBuilder(endpointParams: PostParams) {
  // create an empty URLSearchParams object
  const query = new URLSearchParams();

  // loop through the endpointParams object and append each key-value pair to the query
  for (const [key, value] of Object.entries(endpointParams)) {
    query.append(key, value as string);
  }

  return query;
}

export function slugExtractor(link: string) {
  return new URL(link).pathname.split('/')[1];
}

export async function detectRedirects(posts: Post[]) {
  const newPosts = await Promise.all(
    posts.map(async (post) => {
      try {
        const linkSlug = slugExtractor(post.link as string);
        if (post.slug !== linkSlug) {
          const redirectedPost = await fetchPageBySlug(linkSlug);

          if (redirectedPost && redirectedPost.length > 0) {
            redirectedPost[0] = {
              ...redirectedPost[0],
              categories: post.categories,
            };
          }

          return redirectedPost;
        } else {
          return post;
        }
      } catch (error) {
        console.error('Error in detectRedirects:', error);
        return post;
      }
    })
  );

  return newPosts.flat();
}


