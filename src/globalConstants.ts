import type {
  CategoryFields,
  PageFields,
  PostFields,
} from './types';

/*Pages to exclude when generating dynamic routes*/

const EXCLUDED_PAGES = new Set([
  "capcalera",
  "peu-de-pagina",
  "la-familia-cbg",
  "equips",
  "patrocinadors-principals-logos-blaus",
  "patrocinadors-principals-logos-blancs",
  "altres-patrocinadors",
  "xarxes-socials",
  "jugadors-equip-senior-masculi",
  "jugadores-equip-senior-femeni",
]);

/*API constants fields*/
const POST_FIELDS: PostFields[] = [
  'title',
  'content',
  'link',
  'slug',
  'categories',
  'date',
  'id'
];

const CATEGORY_FIELDS: CategoryFields[] = ['id', 'name', 'slug'];

const PAGE_FIELDS: PageFields[] = ["title", "content", "image", "date", "slug"];

export { EXCLUDED_PAGES, POST_FIELDS, CATEGORY_FIELDS, PAGE_FIELDS };