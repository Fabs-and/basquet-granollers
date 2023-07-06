import type { Url } from 'url';

// Enum declarations

export enum PostFields {
  author = 'author',
  categories = 'categories',
  comment_status = 'comment_status',
  content = 'content',
  date = 'date',
  date_gmt = 'date_gmt',
  excerpt = 'excerpt',
  featured_media = 'featured_media',
  format = 'format',
  guid = 'guid',
  id = 'id',
  link = 'link',
  meta = 'meta',
  modified = 'modified',
  modified_gmt = 'modified_gmt',
  ping_status = 'ping_status',
  slug = 'slug',
  status = 'status',
  sticky = 'sticky',
  tags = 'tags',
  template = 'template',
  title = 'title',
  type = 'type',
}

export enum CategoryFields {
  count = 'count',
  description = 'description',
  id = 'id',
  link = 'link',
  meta = 'meta',
  parent = 'parent',
  name = 'name',
  slug = 'slug',
  taxonomy = 'taxonomy',
}

export enum Endpoints {
  blockDirectoryItems = 'block-directory/search',
  blockRenderer = 'block-rendered',
  blockRevisions = '<id>/autosaves',
  blocks = 'blocks',
  blockTypes = 'block-types',
  categories = 'categories',
  comments = 'comments',
  media = 'media',
  pages = 'pages',
  pageRevisions = `pages/<id>/revisions`,
  plugins = 'plugins',
  postRevisions = `posts/<id>/revisions`,
  posts = 'posts',
  postStatuses = 'statuses',
  postTypes = 'types',
  search = 'search',
  settings = 'settings',
  tags = 'tags',
  taxonomies = 'taxonomies',
  themes = 'themes',
  users = 'users',
}

export interface GlobalParams {
  _fields?: string;
  _embed?: string;
  _method?: string;
  _envelope?: string;
  _jsonp?: string;
}

export interface PostParams extends GlobalParams {
  context?: 'view' | 'embed' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  author?: number | number[];
  author_exclude?: number | number[];
  before?: string;
  exclude?: number | number[];
  include?: number | number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?:
    | 'author'
    | 'date'
    | 'id'
    | 'include'
    | 'modified'
    | 'parent'
    | 'relevance'
    | 'slug'
    | 'include_slugs'
    | 'title';
  slug?: string | string[];
  status?: string | string[];
  categories?: number | number[];
  categories_exclude?: number | number[];
  tags?: number | number[];
  tags_exclude?: number | number[];
  sticky?: boolean;
  tax_relation?: 'AND' | 'OR';
}

// Type declarations

export type Post = {
  author: number;
  categories: number[];
  comment_status: string;
  content: { rendered: string };
  date: string;
  date_gmt: string | null | Date;
  excerpt: { rendered: string };
  featured_media: number;
  format: string;
  guid: string;
  id: { rendered: string; raw: string };
  link: string | Url;
  meta: Record<string, string | number | boolean | any[] | Record<string, any>>;
  modified: string | Date;
  modified_gmt: string | Date;
  ping_status: string;
  slug: string;
  status: string;
  sticky: string;
  tags: number[];
  template: string;
  title: { rendered: string };
  type: string;
};

export type Category = {
  count: number;
  description: string;
  id: number;
  link: string;
  meta: Record<string, string | number | boolean | any[] | Record<string, any>>;
  name: string;
  slug: string;
  taxonomy: string;
};

