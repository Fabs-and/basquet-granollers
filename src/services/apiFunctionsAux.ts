import type { CustomImage, Media, Page, Post, PostParams } from "../types";
import { getData, getPageBySlug } from "./apiFunctions";

/**
 * Builds an object containing endpoint parameters based on the provided fields and quantity.
 * @param {string[]} [fields] - The fields to include in the endpoint parameters.
 * @param {number} [quantity] - The number of items to fetch.
 * @returns {PostParams} An object containing the endpoint parameters.
 */
export function endpointParamsBuilder(
  fields?: string[],
  quantity?: number,
  parentId?: number,
): PostParams {
  const endpointParams: PostParams = {};

  if (Array.isArray(fields) && fields.length > 0) {
    const uniqueFields = [...new Set(fields)];

    // Check if 'link' is already included, if not, add it
    if (!uniqueFields.includes("link")) {
      uniqueFields.push("link");
    }

    // Check if 'image' is included, if so, ensure 'featured_media' is also included
    if (
      uniqueFields.includes("image") &&
      !uniqueFields.includes("featured_media")
    ) {
      uniqueFields.push("featured_media");
    }

    endpointParams._fields = uniqueFields.join(",");
  }

  if (typeof quantity === "number") {
    endpointParams.per_page = quantity;
  }

  if (typeof parentId === "number") {
    endpointParams.parent = parentId;
  }

  return endpointParams;
}

/**
 * Constructs a URLSearchParams object from the provided endpoint parameters.
 * @param {PostParams} endpointParams - The endpoint parameters to convert into a query string.
 * @returns {URLSearchParams} A URLSearchParams object containing the query parameters.
 */
export function queryBuilder(endpointParams: PostParams) {
  // create an empty URLSearchParams object
  const query = new URLSearchParams();
  // loop through the endpointParams object and append each key-value pair to the query
  for (const [key, value] of Object.entries(endpointParams)) {
    query.append(key, value as string);
  }

  return query;
}

/**
 * Extracts the slug from a given URL.
 * @param {string} link - The URL to extract the slug from.
 * @returns {string} The extracted slug.
 */
export function slugExtractor(link: string) {
  return new URL(link).pathname.split("/")[1];
}

/**
 * Detects and resolves redirects in an array of posts.
 * @param {Post[]} posts - The array of posts to check for redirects.
 * @returns {Promise<Post[]>} A new array of posts with redirects resolved.
 */
export async function detectRedirects(posts: Post[]): Promise<(Post | Page)[]> {
  const newPosts: (Post | Page)[] = [];

  for (const post of posts) {
    try {
      const linkSlug = slugExtractor(post.link as string);

      if (post.slug !== linkSlug) {
        const redirectedPost = await getPageBySlug(linkSlug);

        if (redirectedPost && redirectedPost.length > 0) {
          redirectedPost[0] = {
            ...redirectedPost[0],
            categories: post.categories,
            image: post.image,
            title: { rendered: post.title.rendered },
          };
        }

        newPosts.push(...redirectedPost);
      } else {
        newPosts.push(post);
      }
    } catch (error) {
      console.error("Error in detectRedirects:", error);
      newPosts.push(post);
    }
  }

  return newPosts;
}

export async function addImagesToPost(data: Post[] | Page[]): Promise<(Post | Page)[]> {
  const postsWithImages: (Post | Page)[] = [];

  for (const post of data) {
    try {
      if (post?.image || post?.imatge_destacada_interior) {
        postsWithImages.push(post);
      } else {
        let updatedPost: Post | Page = { ...post };

        if (post?.featured_media) {
          const imageLink = await getImageData(post.featured_media);
          updatedPost.image = imageLink;
        }

        if (post?.acf?.imatge_destacada_interior != null) {
          const imageLinkInterior = await getImageData(post.acf.imatge_destacada_interior);
          updatedPost.imatge_destacada_interior = imageLinkInterior;
        }

        postsWithImages.push(updatedPost);
      }
    } catch (error) {
      console.error("Error in addImageToPost:", error);
      postsWithImages.push(post);
    }
  }

  return postsWithImages;
}
// export async function addImagesToPost(data: Post[] | Page[]): Promise<(Post | Page)[]> {
//   const postsWithImages: (Post | Page)[] = [];

//   for (const post of data) {
//     try {
//       if (post?.image || !post?.featured_media || post?.acf) {
//         postsWithImages.push(post);
//       } else {
//         const imageLink = await getImageLink(post.featured_media);
//         const updatedPost = { ...post, image: imageLink };
//         postsWithImages.push(updatedPost);
//       }
//     } catch (error) {
//       console.error("Error in addImageToPost:", error);
//       postsWithImages.push(post);
//     }
//   }

//   return postsWithImages;
// }

// export async function addImagesToPost(
//   data: Post[] | Page[],
// ): Promise<(Post | Page)[]> {
//   const postsWithImages: (Post | Page)[] = [];

//   for (const post of data) {
//     try {
//       if (post?.image || !post?.featured_media) {
//         postsWithImages.push(post);
//       } else {
//         const imageLink = await getImageData(post.featured_media);
//         const updatedPost = { ...post, image: imageLink };
//         postsWithImages.push(updatedPost);
//       }

//       // Check if the post has ACF data and imatge_destacada_interior field
//       if (post?.acf.imatge_destacada_interior !== null) {
//         const imageId = post.acf.imatge_destacada_interior;
//         console.log('idddddd', post);
//         const imageLinkInterior = await getImageData(
//           post.acf.imatge_destacada_interior,
//         );
//         // console.log('adddding link', imageLinkInterior);
//         const updatedPost = { ...post, imagetge_destacada_interior: imageLinkInterior };
//         postsWithImages.push(updatedPost);
//       }
//     } catch (error) {
//       // console.error("Error in addImageToPost:", error);
//       postsWithImages.push(post);
//     }
//   }

//   return postsWithImages;
// }

export async function getImageData(featured_media: number) {
  try {
    const imageMetaInfo = await getData<Media>(`${"media"}/${featured_media}`);

    // Default return object in case anything is missing
    const defaultResponse = {
      id: null,
      url: "",
      title: "",
      alt: "",
      description: "",
      caption: "",
      // ... add any other properties you want to default to here
    };

    if (!imageMetaInfo || !imageMetaInfo[0]) {
      return defaultResponse;
    }

    const mediaItem = imageMetaInfo[0];
    const mediaDetails = mediaItem.media_details;
    const title = mediaItem.title;
    const description = mediaItem.description
      ? mediaItem.description.rendered
      : "";
    const caption = mediaItem.caption ? mediaItem.caption.rendered : "";
    const imageId = mediaItem.id; // Extracting the image ID

    if (!mediaDetails || !mediaDetails.sizes) {
      return defaultResponse;
    }

    const fullSize = mediaDetails.sizes.full;

    if (!fullSize || !fullSize.source_url) {
      return defaultResponse;
    }

    const imageUrl = fullSize.source_url;
    const imageTitle = title ? title.rendered : "";
    const imageAlt = mediaItem.alt_text || "";

    return {
      id: imageId,
      url: imageUrl,
      title: imageTitle,
      alt: imageAlt,
      caption: extractUrlFromCaption(caption, description),
      // ... extract other properties from mediaItem here
    };
  } catch (error) {
    console.error("Error in getImageData:", error);
    return {
      id: null,
      url: "",
      title: "Error retrieving image",
      alt: "Error retrieving image",
      description: "Error retrieving image description",
      caption: "Error retrieving image caption",
      // ... add any other error default properties here
    };
  }
}

// Remove the import statement for PostParams since it is already imported in another file
// import { PostParams } from './types';

export async function getImagesInfo(id: number) {
  try {
    const fields = [
      "id",
      "source_url",
      "title",
      "alt_text",
      "caption",
      "description",
    ];
    const quantity = 100;

    const endpointParams: PostParams = endpointParamsBuilder(
      fields,
      quantity,
      id,
    );

    const images = await getData<Media>(
      `${"media"}`,
      queryBuilder(endpointParams),
    );
    const imageDetails = images.map((image) => ({
      id: image.id,
      url: image.source_url,
      title: image.title.rendered,
      alt: image.alt_text,
      caption: extractUrlFromCaption(
        image.caption.rendered,
        image.description.rendered,
      ),
    }));

    return imageDetails;
  } catch (error) {
    console.error("Error in getImagesInfo:", error);
    throw error; // Propagate the error to the caller
  }
}

export function removeParagraphTags(string: string) {
  // Remove the <p> and </p> tags and newlines
  let cleanedString = string.replace(/<\/?p[^>]*>/g, "").replace(/\n/g, "");

  // Trim spaces at the beginning and end
  return cleanedString.trim();
}

export function extractUrlFromCaption(caption: string, description: string) {
  const match = description.match(
    /<blockquote[^>]*>.*?href=["'](http[^"']+)["']/,
  );

  if (match) {
    // Extract the URL from the match
    const url = match[1];
    // Extract the homepage URL by finding the third slash
    const homepage = url.slice(0, url.indexOf("/", url.indexOf("//") + 2) + 1);
    return homepage;
  }
  return removeParagraphTags(caption);
}

export function extractImageUrlsFromContent(content: string): string[] {
  const urls: string[] = [];
  const imgTagRegex = /<img[^>]+src="(https:\/\/[^">]+)"/g;
  let match;

  while ((match = imgTagRegex.exec(content))) {
    urls.push(match[1]);
  }

  return urls;
}

export function sortImagesByAppearanceOrder(
  images: CustomImage[],
  imageUrls: string[],
): CustomImage[] {
  const imageUrlOrderMapping: { [url: string]: number } = {};
  imageUrls.forEach((url, index) => {
    const baseUrl = getBaseUrl(url);
    imageUrlOrderMapping[baseUrl] = index;
  });

  images.sort(
    (a, b) =>
      imageUrlOrderMapping[getBaseUrl(a.url)] -
      imageUrlOrderMapping[getBaseUrl(b.url)],
  );

  return images;
}
function getBaseUrl(url: string): string {
  // Remove dimension, file extension and trailing '.' (e.g., "-150x150.png") from URL
  return url.replace(/-\d+x\d+(\.\w+)?$/, "").replace(/\.\w+$/, "");
}
