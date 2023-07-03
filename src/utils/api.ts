import type { Endpoints, PostFields, CategoryFields } from '../types';
const API_URL = import.meta.env.API_URL;

// Gets post by API URL and given path
// If no arguments in getPosts, it retrieves all fields of all posts
export async function getFromAPI(
  endpoint: Endpoints,
  fields?: PostFields[] | CategoryFields[],
  quantity?: number
) {
  const params = {};

  if (typeof fields !== 'undefined') {
    fields.length > 0 && Object.assign(params, { _fields: fields.join(',') });
  }

  quantity && Object.assign(params, { per_page: quantity });
  console.log(params);

  // create an empty URLSearchParams object
  const query = new URLSearchParams();

  // loop through the params object and append each key-value pair to the query
  for (const [key, value] of Object.entries(params)) {
    query.append(key, value as string);
  }

  const posts = await getCall(endpoint, query);

  return posts;
}

export async function getCall(endpoint: Endpoints, query?: URLSearchParams) {
  // append the query parameter to the URL
  const url = new URL(`${API_URL}/${endpoint}`);
  if (query) url.search = query.toString();

  // pass the url to fetch
  const res = await fetch(url);
  const json = await res.json();

  return json;
}
