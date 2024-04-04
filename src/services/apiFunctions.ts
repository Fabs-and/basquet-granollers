import {
  detectRedirects,
  endpointParamsBuilder,
  getImagesInfo,
  queryBuilder,
  extractUrlFromCaption,
  extractImageUrlsFromContent,
  sortImagesByAppearanceOrder,
} from "./apiFunctionsAux";

import { FetchError } from "../types";

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
  CBGContent,
  SeniorTeamData,
  Team,
  TransformedResultCache,
} from "../types";

import { IMAGE_FIELDS } from "@data/globalConstants";

// Constants
const WP_API = "/wp-json/wp/v2";
const USERNAME = import.meta.env.USERNAME;
const WP_APPLICATION_PASSWORD = import.meta.env.WP_APPLICATION_PASSWORD;
const TOKEN = btoa(`${USERNAME}:${WP_APPLICATION_PASSWORD}`);

// Variables
let postsQueryCache: PostsQueryCache = {};
let imageFetchPromise: Promise<Media[] | null> | null = null;
let transformedResultCache: TransformedResultCache = {};

// Helper function to fetch data with retries
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
        console.error("Response Status:", res.status);
        console.error("Response Headers:", JSON.stringify([...res.headers]));
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
  throw lastError;
}

// Generic function to fetch data from the WordPress API
export async function getData<T>(
  endpoint: Endpoints | PostsWithId | PagesWithId | MediaWithId | CustomEndpoint,
  query?: URLSearchParams,
): Promise<T[]> {
  const url = new URL(`${import.meta.env.PUBLIC_BASE_URL}${WP_API}/${endpoint}`);
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

// Posts-related functions
export async function getPosts(
  quantity?: number,
  postFields?: PostFields[],
): Promise<Post[]> {
  try {
    const cacheKey = JSON.stringify({ quantity, postFields });
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
    throw error;
  }
}

export async function getPostsInCategories(
  categoryIds: number[],
  postFields?: PostFields[],
  quantity?: number,
): Promise<Post[]> {
  try {
    const endpointParams = endpointParamsBuilder(postFields, quantity);
    endpointParams.categories = categoryIds.join(",");
    const data = await getData<Post>("posts", queryBuilder(endpointParams));
    const posts = await detectRedirects(data);
    return posts as Post[];
  } catch (error) {
    console.error("Error in getPostsInCategories:", error);
    throw error;
  }
}

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
    throw error;
  }
}

export async function getPostById(
  id: number,
  postFields?: PostFields[],
): Promise<Post[]> {
  try {
    const endpointParams = endpointParamsBuilder(postFields);
    const post = await getData<Post>(`${"posts"}/${id}`, queryBuilder(endpointParams));
    return post;
  } catch (error) {
    console.error("Error in getPostById:", error);
    throw error;
  }
}

// Categories-related functions
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
    throw error;
  }
}

// Pages-related functions
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
    throw error;
  }
}

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
    throw error;
  }
}

export async function getPageById(
  id: number,
  pageFields?: PageFields[],
): Promise<Page[]> {
  try {
    const endpointParams = endpointParamsBuilder(pageFields);
    const page = await getData<Page>(`${"pages"}/${id}`, queryBuilder(endpointParams));
    return page;
  } catch (error) {
    console.error("Error in getPageById:", error);
    throw error;
  }
}

// Images-related functions
export async function getImages() {
  try {
    if (transformedResultCache["allImages"]) {
      return transformedResultCache["allImages"];
    }
    if (imageFetchPromise) {
      return await imageFetchPromise;
    }
    const quantity = 100;
    const endpointParams = endpointParamsBuilder(IMAGE_FIELDS, quantity);
    imageFetchPromise = getData<Media>(`${"media"}`, queryBuilder(endpointParams));
    const images = await imageFetchPromise;
    const transformedResult = images!.map((image) => {
      return {
        id: image.id,
        url: image.source_url,
        title: image.title.rendered,
        alt: image.alt_text,
        caption: extractUrlFromCaption(image.caption.rendered, image.description.rendered),
      };
    });
    transformedResultCache["allImages"] = transformedResult;
    return transformedResult;
  } catch (error) {
    console.error("Error in getImages:", error);
    throw error;
  }
}

export async function getImagesBySlug(slug: string): Promise<CustomImage[]> {
  try {
    const page = await getPageBySlug(slug, ["id", "content"]);
    if (!page.length) throw new Error(`Page not found for slug: ${slug}`);
    const { id, content } = page[0];
    const renderedImagesUrls = extractImageUrlsFromContent(content.rendered);
    const renderedImagesUrlsSet = new Set(renderedImagesUrls);
    const imagesWithSamePageParent = await getImagesInfo(id);
    if (
      renderedImagesUrls.length === 1 &&
      imagesWithSamePageParent.length === 0
    ) {
      const customImage: CustomImage = {
        url: renderedImagesUrls[0],
        title: "",
        alt: "",
        caption: "",
      };
      return [customImage];
    }
    const imagesInParentPage = imagesWithSamePageParent.find(
      (image) => image.url === renderedImagesUrls[0],
    );
    if (renderedImagesUrls.length === 1 && imagesInParentPage !== undefined) {
      return [imagesInParentPage];
    }
    if (renderedImagesUrls.length === imagesWithSamePageParent.length) {
      return sortImagesByAppearanceOrder(imagesWithSamePageParent, renderedImagesUrls);
    }
    const imagesRendered = imagesWithSamePageParent.filter((image) =>
      renderedImagesUrlsSet.has(image.url),
    );
    if (imagesRendered.length === renderedImagesUrlsSet.size) {
      return sortImagesByAppearanceOrder(imagesRendered, renderedImagesUrls);
    }
    const allMedia = await getImages();
    const filteredImages =
      allMedia && allMedia.length
        ? allMedia.filter((media) => renderedImagesUrlsSet.has(media.url))
        : [];
    if (filteredImages.length === 0) {
      return imagesWithSamePageParent;
    }
    return sortImagesByAppearanceOrder(filteredImages, renderedImagesUrls);
  } catch (error) {
    console.error("Error in getImagesBySlug:", error);
    throw error;
  }
}

// Custom endpoint functions
export async function getCapcalera(): Promise<Capcalera> {
  try {
    const endpointParams = endpointParamsBuilder();
    const post = await getData<Capcalera>("capcalera", queryBuilder(endpointParams));
    const { capcalera_superior, capcalera_inferior } = post[0];
    return { capcalera_superior, capcalera_inferior };
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    throw error;
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const endpointParams = endpointParamsBuilder();
    const posts = await getData<HeroSlide>("carrusel", queryBuilder(endpointParams));
    return posts;
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    throw error;
  }
}

export async function getFooter(): Promise<Footer[]> {
  try {
    const endpointParams = endpointParamsBuilder();
    const posts = await getData<Footer>("footer", queryBuilder(endpointParams));
    return posts;
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    throw error;
  }
}

export async function getFamiliaSection(): Promise<FamiliaData> {
  try {
    const endpointParams = endpointParamsBuilder();
    const familiaData = await getData<FamiliaData>("familia", queryBuilder(endpointParams));
    const sponsors = familiaData.find((item) => item.hasOwnProperty("sponsors"));
    const membres = familiaData.find((item) => item.hasOwnProperty("membres"));
    return {
      sponsors: sponsors ? sponsors.sponsors : { buttonText: "", deals: [] },
      membres: membres ? membres.membres : { buttonText: "", deals: [] },
    };
  } catch (error) {
    console.error("Error in getFamiliaSection:", error);
    throw error;
  }
}

export async function getFamiliaSectionContactaMessage(): Promise<FamiliaMissatge> {
  try {
    const endpointParams = endpointParamsBuilder();
    const familiaMissatge = await getData<FamiliaMissatge>(
      "missatge",
      queryBuilder(endpointParams),
    );
    return familiaMissatge[0];
  } catch (error) {
    console.error("Error in getFamiliaSection:", error);
    throw error;
  }
}

export async function getSocialMedia(): Promise<XarxaSocial[]> {
  try {
    const endpointParams = endpointParamsBuilder();
    const socialMediaResponse = await getData<XarxaSocial[]>(
      "xarxes-socials",
      queryBuilder(endpointParams),
    );
    let socialMediaData = Object.values(socialMediaResponse[0]).slice(0, -1);
    return socialMediaData;
  } catch (error) {
    console.error("Error in getFamiliaSection:", error);
    throw error;
  }
}
export async function getPageSectionTitles(): Promise<CBGContent> {
  try {
    const endpointParams = endpointParamsBuilder();
    const titles = await getData<CBGContent>("titols", queryBuilder(endpointParams));
    return titles[0];
  } catch (error) {
    console.error("Error in getFamiliaSection:", error);
    throw error;
  }
}

export async function getSeniorTeamsData(): Promise<{
  maleSenior: Team;
  femaleSenior: Team;
}> {
  try {
    const endpointParams = endpointParamsBuilder();
    const seniorTeams = await getData<SeniorTeamData>("jugadors", queryBuilder(endpointParams));
    const maleSenior = seniorTeams[0].male;
    const femaleSenior = seniorTeams[1].female;
    return { maleSenior, femaleSenior };
  } catch (error) {
    console.error("Error in getFamiliaSection:", error);
    throw error;
  }
}