import type {
  CategoryFields,
  CommonPagesAndPostsFields,
  PageFields,
  PostFields,
} from '../types';

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

const COMMON_FIELDS: CommonPagesAndPostsFields[] = ["title", "content", "image", "date", "slug"];

const TEAMS_SLUGS = [
  { word: "masculins", slug: "/equips/masculins" },
  { word: "femenins", slug: "/equips/femenins" },
  { word: "escola", slug: "/equips/escola-de-basquet" },
  { word: "cadira", slug: "/equips/cadira-de-rodes" },
];

export { EXCLUDED_PAGES, POST_FIELDS, CATEGORY_FIELDS, COMMON_FIELDS, TEAMS_SLUGS };