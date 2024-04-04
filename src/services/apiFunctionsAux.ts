import type { CustomImage, Media, Page, Post, PostParams } from "../types";
import { getData, getPageBySlug } from "./apiFunctions";

// Helper function to build endpoint parameters
export function endpointParamsBuilder(
  fields?: string[],
  quantity?: number,
  parentId?: number,
): PostParams {
  const endpointParams: PostParams = {};

  if (Array.isArray(fields) && fields.length > 0) {
    const uniqueFields = [...new Set(fields)];

    if (!uniqueFields.includes("link")) {
      uniqueFields.push("link");
    }

    if (uniqueFields.includes("image") && !uniqueFields.includes("featured_media")) {
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

// Helper function to build query string from endpoint parameters
export function queryBuilder(endpointParams: PostParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(endpointParams)) {
    query.append(key, value as string);
  }
  return query;
}

// Helper function to extract slug from URL
export function slugExtractor(link: string) {
  return new URL(link).pathname.split("/")[1];
}

// Function to detect redirects in posts and convert them to pages
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

// Function to add images to posts or pages
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

// Function to retrieve image data by featured media ID
export async function getImageData(featured_media: number) {
  try {
    const imageMetaInfo = await getData<Media>(`${"media"}/${featured_media}`);

    const defaultResponse = {
      id: null,
      url: "",
      title: "",
      alt: "",
      description: "",
      caption: "",
    };

    if (!imageMetaInfo || !imageMetaInfo[0]) {
      return defaultResponse;
    }

    const mediaItem = imageMetaInfo[0];
    const mediaDetails = mediaItem.media_details;
    const title = mediaItem.title;
    const description = mediaItem.description ? mediaItem.description.rendered : "";
    const caption = mediaItem.caption ? mediaItem.caption.rendered : "";
    const imageId = mediaItem.id;

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
    };
  }
}

// Function to retrieve image information by parent ID
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

    const endpointParams: PostParams = endpointParamsBuilder(fields, quantity, id);
    const images = await getData<Media>(`${"media"}`, queryBuilder(endpointParams));

    const imageDetails = images.map((image) => ({
      id: image.id,
      url: image.source_url,
      title: image.title.rendered,
      alt: image.alt_text,
      caption: extractUrlFromCaption(image.caption.rendered, image.description.rendered),
    }));

    return imageDetails;
  } catch (error) {
    console.error("Error in getImagesInfo:", error);
    throw error;
  }
}

// Helper function to remove paragraph tags from a string
export function removeParagraphTags(string: string) {
  let cleanedString = string.replace(/<\/?p[^>]*>/g, "").replace(/\n/g, "");
  return cleanedString.trim();
}

// Helper function to extract URL from image caption or description
export function extractUrlFromCaption(caption: string, description: string) {
  const match = description.match(/<blockquote[^>]*>.*?href=["'](http[^"']+)["']/);

  if (match) {
    const url = match[1];
    const homepage = url.slice(0, url.indexOf("/", url.indexOf("//") + 2) + 1);
    return homepage;
  }
  return removeParagraphTags(caption);
}

// Helper function to extract image URLs from content
export function extractImageUrlsFromContent(content: string): string[] {
  const urls: string[] = [];
  const imgTagRegex = /<img[^>]+src="(https:\/\/[^">]+)"/g;
  let match;

  while ((match = imgTagRegex.exec(content))) {
    urls.push(match[1]);
  }

  return urls;
}

// Helper function to sort images based on their appearance order
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
      imageUrlOrderMapping[getBaseUrl(a.url)] - imageUrlOrderMapping[getBaseUrl(b.url)],
  );

  return images;
}

// Helper function to get the base URL of an image
function getBaseUrl(url: string): string {
  return url.replace(/-\d+x\d+(\.\w+)?$/, "").replace(/\.\w+$/, "");
}