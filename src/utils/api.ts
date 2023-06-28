import type { Fields } from '../types';
const API_URL = import.meta.env.API_URL;

// Gets post by API URL and given path
// If no arguments in getPosts, it retrieves all fields of all posts
export async function getPosts(fields?: Fields[], postsLimit?: number) {
  
  const params = {};

  if (typeof fields !== 'undefined') {
    fields.length > 0 && Object.assign(params, { _fields: fields.join(',') });
  }

  postsLimit && Object.assign(params, { per_page: postsLimit });
  console.log(params);

  // create an empty URLSearchParams object
  const query = new URLSearchParams();

  // loop through the params object and append each key-value pair to the query
  for (const [key, value] of Object.entries(params)) {
    query.append(key, value as string);
  }

  // add the query string to the API URL
  const res = await fetch(`${API_URL}?${query.toString()}`);
  const json = await res.json();

  return json;
}
