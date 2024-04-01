// Making types available for import when package is installed
import {
  addImagesToPost,
  detectRedirects,
  endpointParamsBuilder,
  getImagesInfo,
  queryBuilder,
  extractUrlFromCaption,
  extractImageUrlsFromContent,
  sortImagesByAppearanceOrder,
} from "./apiFunctionsAux";

import { FetchError } from "../types";
// import TS types

import type {
  CategoryFields,
  Post,
  PageFields,
  Endpoints,
  PostFields,
  PostsWithId,
  PagesWithId,
  Category,
  Page,
  MediaWithId,
  Media,
  CustomEndpoint,
  CustomImage,
  PostsQueryCache,
  Capcalera,
  HeroSlide,
  Footer,
  FamiliaData,
  FamiliaMissatge,
  XarxaSocial,
} from "../types";

import { IMAGE_FIELDS } from "@data/globalConstants";

async function fetchWithRetry(
  url: URL,
  retries: number = 3,
  delay: number = 1000,
): Promise<Response> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Basic ${TOKEN}`,
        },
      });
      if (!res.ok) {
        // Log status and headers if there's an error
        console.error("Response Status:", res.status);
        console.error("Response Headers:", JSON.stringify([...res.headers]));

        // Log response body if there's an error
        const responseBody = await res.text();
        console.error("Response Body:", responseBody);

        throw new FetchError(
          `Error in fetch: ${res.status} ${res.statusText}`,
          res.status,
          url.toString(),
        );
      }
      return res;
    } catch (error) {
      console.error(
        `Attempt ${i + 1} failed. Retrying in ${delay}ms...`,
        error,
      );
      lastError = error;
      if (i < retries - 1) await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastError; // Ensure that an error is thrown if all retries fail
}

// Variables Declarations

const WP_API = "/wp-json/wp/v2"; // This may change if Wordpress changes the Wordpress API

// Functions Declarations
/**
 * Fetches data from the specified endpoint and query parameters.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {URLSearchParams} [query] - The query parameters for the request.
 * @returns {Promise<Post[] | Category[] | Page[]>} The fetched data as a JSON object.
 * @throws {Error} If the fetch request fails.
 */

const USERNAME = import.meta.env.USERNAME;
const WP_APPLICATION_PASSWORD = import.meta.env.WP_APPLICATION_PASSWORD;
const TOKEN = btoa(`${USERNAME}:${WP_APPLICATION_PASSWORD}`);

export async function getData<T>(
  endpoint:
    | Endpoints
    | PostsWithId
    | PagesWithId
    | MediaWithId
    | CustomEndpoint,
  query?: URLSearchParams,
): Promise<T[]> {
  const url = new URL(
    `${import.meta.env.PUBLIC_BASE_URL}${WP_API}/${endpoint}`,
  );

  try {
    if (query) {
      url.search = query.toString();
    }

    const res = await fetchWithRetry(url);

    if (!res.ok) {
      console.error(
        "Error in getData:",
        `Response not OK. Status: ${res.status}, StatusText: ${res.statusText}`,
        "URL:",
        url.toString(),
      );
      throw new Error(`Error in getData: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error in getData:", error, "URL:", url.toString());
    throw error;
  }
}

// #### POSTS ####

let postsQueryCache: PostsQueryCache = {};
/**
 * Fetches a specified number of posts with optional fields.
 * @param {number} [quantity] - The number of posts to fetch.
 * @param {PostFields[]} [postFields] - The fields to include in the fetched posts.
 * @returns {Promise<Post[]>} The fetched posts as an array of Post objects.
 * @throws {Error} If the fetch request fails.
 */
export async function getPosts(
  quantity?: number,
  postFields?: PostFields[],
): Promise<Post[]> {
  try {
    // Create a cache key from the function parameters
    const cacheKey = JSON.stringify({ quantity, postFields });
    // Check the cache for a previous result
    if (postsQueryCache[cacheKey]) {
      return postsQueryCache[cacheKey];
    }
    if (typeof postFields === "undefined" && !quantity) {
      const allPosts = await getData<Post>("posts");
      postsQueryCache[cacheKey] = allPosts;
      return allPosts;
    } else if (typeof postFields !== "undefined" && quantity === -1) {
      const endpointParams = endpointParamsBuilder(postFields);

      const data = await getData<Post>("posts", queryBuilder(endpointParams));

      const allPostsWithCustomFields = await detectRedirects(data);
      postsQueryCache[cacheKey] = allPostsWithCustomFields as Post[];
      return allPostsWithCustomFields as Post[];
    }

    const endpointParams = endpointParamsBuilder(postFields, quantity);

    const data = await getData<Post>("posts", queryBuilder(endpointParams));
    const posts = await detectRedirects(data);
    postsQueryCache[cacheKey] = posts as Post[];

    return posts as Post[];
  } catch (error) {
    console.error("Error in getPosts:", error);
    throw error; // Propagate the error to the caller
  }
}

/**
 * Fetches posts in specific categories with optional fields and quantity.
 * @param {number[]} categoryIds - The IDs of the categories to fetch posts from.
 * @param {PostFields[]} [postFields] - The fields to include in the fetched posts.
 * @param {number} [quantity] - The number of posts to fetch.
 * @returns {Promise<Post[]>} The fetched posts as an array of Post objects.
 * @throws {Error} If the fetch request fails.
 */
export async function getPostsInCategories(
  categoryIds: number[],
  postFields?: PostFields[],
  quantity?: number,
): Promise<Post[]> {
  try {
    const endpointParams = endpointParamsBuilder(postFields, quantity);

    // Join the category IDs into a comma-separated string
    endpointParams.categories = categoryIds.join(",");

    const data = await getData<Post>("posts", queryBuilder(endpointParams));
    const posts = await detectRedirects(data);
    return posts as Post[];
  } catch (error) {
    console.error("Error in getPostsInCategories:", error);
    throw error; // Propagate the error to the caller
  }
}

/**
 * Fetches a post by its slug with optional fields.
 * @param {string} slug - The slug of the post to fetch.
 * @param {PostFields[]} [postFields] - The fields to include in the fetched post.
 * @returns {Promise<Post[]>} The fetched post as a Post object in an array.
 * @throws {Error} If the fetch request fails.
 */
export async function getPostBySlug(
  slug: string,
  postFields?: PostFields[],
): Promise<Post[]> {
  try {
    const endpointParams = endpointParamsBuilder(postFields);

    endpointParams.slug = slug;

    const post = await getData<Post>("posts", queryBuilder(endpointParams));

    return post;
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    throw error; // Propagate the error to the caller
  }
}

export async function getCapcalera(): Promise<Capcalera> {
  try {
    const endpointParams = endpointParamsBuilder();

    const post = await getData<Capcalera>(
      "capcalera",
      queryBuilder(endpointParams),
    );
    const { capcalera_superior, capcalera_inferior } = post[0];
    return { capcalera_superior, capcalera_inferior };
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    throw error; // Propagate the error to the caller
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const endpointParams = endpointParamsBuilder();

    const posts = await getData<HeroSlide>(
      "carrusel",
      queryBuilder(endpointParams),
    );

    return posts;
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    throw error; // Propagate the error to the caller
  }
}

export async function getFooter(): Promise<Footer[]> {
  try {
    const endpointParams = endpointParamsBuilder();

    const posts = await getData<Footer>("footer", queryBuilder(endpointParams));

    return posts;
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    throw error; // Propagate the error to the caller
  }
}
export async function getFamiliaSection(): Promise<FamiliaData> {
  try {
    const endpointParams = endpointParamsBuilder();
    const familiaData = await getData<FamiliaData>("familia", queryBuilder(endpointParams));

    const sponsors = familiaData.find(item => item.hasOwnProperty('sponsors'));
    const membres = familiaData.find(item => item.hasOwnProperty('membres'));

    return {
      sponsors: sponsors ? sponsors.sponsors : { buttonText: '', deals: [] },
      membres: membres ? membres.membres : { buttonText: '', deals: [] }
    };
  } catch (error) {
    console.error("Error in getFamiliaSection:", error);
    throw error; // Propagate the error to the caller
  }
}

export async function getFamiliaSectionContactaMessage(): Promise<FamiliaMissatge> {
  try {
    const endpointParams = endpointParamsBuilder();
    const familiaMissatge = await getData<FamiliaMissatge>("missatge", queryBuilder(endpointParams));

   

    return familiaMissatge[0];
  } catch (error) {
    console.error("Error in getFamiliaSection:", error);
    throw error; // Propagate the error to the caller
  }
}

export async function getSocialMEdia(): Promise<XarxaSocial> {
  try {
    const endpointParams = endpointParamsBuilder();
    const familiaMissatge = await getData<XarxaSocial>("xarxes-socials", queryBuilder(endpointParams));

   console.log('familiaMissatge', familiaMissatge[0])

    return familiaMissatge[0];
  } catch (error) {
    console.error("Error in getFamiliaSection:", error);
    throw error; // Propagate the error to the caller
  }
}
/**
 * Fetches a post by its ID with optional fields.
 * @param {number} id - The ID of the post to fetch.
 * @param {PostFields[]} [postFields] - The fields to include in the fetched post.
 * @returns {Promise<Post[]>} The fetched post as a Post object in an array.
 * @throws {Error} If the fetch request fails.
 */
export async function getPostById(
  id: number,
  postFields?: PostFields[],
): Promise<Post[]> {
  try {
    const endpointParams = endpointParamsBuilder(postFields);
    const post = await getData<Post>(
      `${"posts"}/${id}`,
      queryBuilder(endpointParams),
    );
    return post;
  } catch (error) {
    console.error("Error in getPostById:", error);
    throw error; // Propagate the error to the caller
  }
}

// #### CATEGORIES ####

/**
 * Fetches all categories with optional fields.
 * @param {CategoryFields[]} [categoryFields] - The fields to include in the fetched categories.
 * @returns {Promise<Category[]>} The fetched categories as an array of objects.
 * @throws {Error} If the fetch request fails.
 */
export async function getCategories(
  categoryFields?: CategoryFields[],
): Promise<Category[]> {
  try {
    if (typeof categoryFields === "undefined") {
      const allCategories = await getData<Category>("categories");
      return allCategories;
    }

    const endpointParams = endpointParamsBuilder(categoryFields);

    const categoriesWithCustomFields = await getData<Category>(
      "categories",
      queryBuilder(endpointParams),
    );

    return categoriesWithCustomFields;
  } catch (error) {
    console.error("Error in getCategories:", error);
    throw error; // Propagate the error to the caller
  }
}

// #### PAGES ####

/**
 * Fetches a specified number of pages with optional fields.
 * @param {number} [quantity] - The number of pages to fetch.
 * @param {PageFields[]} [pageFields] - The fields to include in the fetched pages.
 * @returns {Promise<Page[]>} The fetched pages as an array of objects.
 * @throws {Error} If the fetch request fails.
 */
export async function getPages(
  quantity?: number,
  pageFields?: PageFields[],
): Promise<Page[]> {
  try {
    if (typeof pageFields === "undefined" && !quantity) {
      const allPages = await getData<Page>("pages");
      return allPages;
    } else if (typeof pageFields !== "undefined" && quantity === -1) {
      const endpointParams = endpointParamsBuilder(pageFields);

      const allPagesWithCustomFields = await getData<Page>(
        "pages",
        queryBuilder(endpointParams),
      );

      return allPagesWithCustomFields;
    }

    const endpointParams = endpointParamsBuilder(pageFields, quantity);

    const pages = await getData<Page>("pages", queryBuilder(endpointParams));

    return pages;
  } catch (error) {
    console.error("Error in getPages:", error);
    throw error; // Propagate the error to the caller
  }
}

/**
 * Fetches a page by its slug with optional fields.
 * @param {string} slug - The slug of the page to fetch.
 * @param {PageFields[]} [pageFields] - The fields to include in the fetched page.
 * @returns {Promise<Page[]>} The fetched page as a Page object in an array.
 * @throws {Error} If the fetch request fails.
 */

export async function getPageBySlug(
  slug: string,
  pageFields?: PageFields[],
): Promise<Page[]> {
  try {
    const endpointParams = endpointParamsBuilder(pageFields);

    endpointParams.slug = slug;

    const page = await getData<Page>("pages", queryBuilder(endpointParams));

    if (page.length === 0) {
      return [];
    }
    return page;
  } catch (error) {
    console.error("Error in getPageBySlug:", error);
    throw error; // Propagate the error to the caller
  }
}

/**
 * Fetches a page by its ID with optional fields.
 * @param {number} id - The ID of the page to fetch.
 * @param {PageFields[]} [pageFields] - The fields to include in the fetched page.
 * @returns {Promise<Page[]>} The fetched page as a Page object in an array.
 * @throws {Error} If the fetch request fails.
 */
export async function getPageById(
  id: number,
  pageFields?: PageFields[],
): Promise<Page[]> {
  try {
    const endpointParams = endpointParamsBuilder(pageFields);
    const page = await getData<Page>(
      `${"pages"}/${id}`,
      queryBuilder(endpointParams),
    );
    return page;
  } catch (error) {
    console.error("Error in getPageById:", error);
    throw error; // Propagate the error to the caller
  }
}

let imageFetchPromise: Promise<Media[] | null> | null = null;

interface TransformedResultCache {
  allImages?: {
    id: number;
    url: string;
    title: string;
    alt: string;
    caption: string;
  }[]; // Replace YourImageType with the type of your images
}
let transformedResultCache: TransformedResultCache = {}; // Initialize cache as an object

export async function getImages() {
  try {
    // Check the cache first
    if (transformedResultCache["allImages"]) {
      return transformedResultCache["allImages"];
    }

    if (imageFetchPromise) {
      // If a fetch is already in progress, return the existing promise
      return await imageFetchPromise;
    }

    const quantity = 100; // Number of pages

    // Build the endpoint parameters using the updated endpointParamsBuilder
    const endpointParams = endpointParamsBuilder(IMAGE_FIELDS, quantity);

    // Store the new fetch promise in the cache
    imageFetchPromise = getData<Media>(
      `${"media"}`,
      queryBuilder(endpointParams),
    );

    // Wait for the fetch to complete, then transform the result
    const images = await imageFetchPromise;

    const transformedResult = images!.map((image) => {
      return {
        id: image.id,
        url: image.source_url,
        title: image.title.rendered,
        alt: image.alt_text,
        caption: extractUrlFromCaption(
          image.caption.rendered,
          image.description.rendered,
        ),
      };
    });

    // Cache the transformed result for future use
    transformedResultCache["allImages"] = transformedResult;

    // Return the transformed result
    return transformedResult;
  } catch (error) {
    console.error("Error in getImages:", error);
    throw error;
  }
}

export async function getImagesBySlug(slug: string): Promise<CustomImage[]> {
  try {
    // Fetch the page by slug and get its content and ID.
    const page = await getPageBySlug(slug, ["id", "content"]);

    if (!page.length) throw new Error(`Page not found for slug: ${slug}`);

    const { id, content } = page[0];

    // Extract URLs of images rendered on the page.
    const renderedImagesUrls = extractImageUrlsFromContent(content.rendered);
    const renderedImagesUrlsSet = new Set(renderedImagesUrls);

    // Fetch images with the same parent page.
    const imagesWithSamePageParent = await getImagesInfo(id);

    // Fetch all available media.
    const allMedia = await getImages();

    const imagesInParentPage = imagesWithSamePageParent.find(
      (image) => image.url === renderedImagesUrls[0],
    );

    // If there's only one image URL, return it after verifying it's in the parent page images.
    if (renderedImagesUrls.length === 1 && imagesInParentPage !== undefined) {
      return [imagesInParentPage];
    }

    // If the count of rendered images equals images with the same parent, return the parent images.
    if (renderedImagesUrls.length === imagesWithSamePageParent.length) {
      return sortImagesByAppearanceOrder(
        imagesWithSamePageParent,
        renderedImagesUrls,
      );
    }

    // Filter out images from the parent page that match the rendered images.
    const imagesRendered = imagesWithSamePageParent.filter((image) =>
      renderedImagesUrlsSet.has(image.url),
    );

    // If the count of rendered images equals the filtered parent images, return the rendered images.
    if (imagesRendered.length === renderedImagesUrlsSet.size) {
      return sortImagesByAppearanceOrder(imagesRendered, renderedImagesUrls);
    }

    // If images rendered don't share same parent Filter all media to get images that match the rendered images.
    const filteredImages =
      allMedia && allMedia.length
        ? allMedia.filter((media) => renderedImagesUrlsSet.has(media.url))
        : [];

    // If no images were filtered from all media, return the parent images.
    if (filteredImages.length === 0) {
      return imagesWithSamePageParent;
    }

    // Return the sorted images by appearance order.
    return sortImagesByAppearanceOrder(filteredImages, renderedImagesUrls);
  } catch (error) {
    console.error("Error in getImagesBySlug:", error);
    throw error;
  }
}
