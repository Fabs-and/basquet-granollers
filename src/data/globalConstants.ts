import type {
  CategoryFields,
  PageFields,
  PostFields,
} from "../types";

/*Pages to exclude when generating dynamic routes*/

const IMAGE_FIELDS = [
  "id",
  "source_url",
  "title",
  "alt_text",
  "caption",
  "description",
];

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
  "title",
  "content",
  "link",
  "slug",
  "categories",
  "date",
  "image",
  "imatge_destacada_interior",
  "id",
];

const PROJECTS_AND_HERO_SLIDES_FIELDS: PostFields[] = [
  "title",
  "content",
  "image",
  'slug',
  "categories",
];

const CATEGORY_FIELDS: CategoryFields[] = ["id", "name", "slug"];

const PAGE_FIELDS: PageFields[] = [
  "title",
  "content",
  "image",
  "slug",
];

const TEAMS_SLUGS = [
  { word: "masculins", slug: "/equips/masculins" },
  { word: "femenins", slug: "/equips/femenins" },
  { word: "escola", slug: "/equips/escola-de-basquet" },
  { word: "cadira", slug: "/equips/cadira-de-rodes" },
];

const PROJECTS_CATEGORY_ID = 42;
const NEWS_CATEGORY_ID = 19;
const HERO_SLIDES_CATEGORY_ID = 40;
const FEATURED_NEWS_CATEGORY_ID = 41;

const CONFIG_PAGES = {
  header: "capcalera",
  footer: "peu-de-pagina",
  socialMedia: "xarxes-socials",
  homePageJoinSection: "la-familia-cbg",
  homePageTeamsSection: "equips",
  homePageMainSponsorsWhite: "patrocinadors-principals-logos-blancs",
  homePageMainSponsorsBlue: "patrocinadors-principals-logos-blaus",
  homePageOtherSponsors: "altres-patrocinadors",
};

const TEAM_PAGES = {
  allTeams: "equips",
  maleTeams: "equips-masculins",
  femaleTeams: "equips-femenins",
  school: "escola",
  wheelchair: "cadira-de-rodes",
  maleSenior: "jugadors-equip-senior-masculi",
  femaleSenior: "jugadores-equip-senior-femeni",
  coaches: "cos-tecnic",
};

export {
  EXCLUDED_PAGES,
  POST_FIELDS,
  CATEGORY_FIELDS,
  PAGE_FIELDS,
  TEAMS_SLUGS,
  PROJECTS_CATEGORY_ID,
  NEWS_CATEGORY_ID,
  HERO_SLIDES_CATEGORY_ID,
  FEATURED_NEWS_CATEGORY_ID,
  CONFIG_PAGES,
  TEAM_PAGES,
  PROJECTS_AND_HERO_SLIDES_FIELDS,
  IMAGE_FIELDS,
};
