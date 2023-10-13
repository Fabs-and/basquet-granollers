/*Started to look at types, however I decided to stop working on them until I decide how to get the information from wordpress and I can know the definite types of the content I am getting. I may be able to use types that are already created in the fetch-wordpress-api package*/

// Define the interface for the link object
export type Link = {
  name: string;
  slug: string;
}

// Define the interface for the category object
export type Category = {
  title: string;
  links: Link[];
}

