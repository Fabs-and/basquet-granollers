import {
  fetchImagesInPageBySlug,
  fetchPageBySlug,
  fetchPages,
  fetchPosts,
  fetchPostsInCategory,
} from "@utils/apiFunctions";

import { COMMON_FIELDS } from "./globalConstants";

export const [
  projects,
  news,
  heroSlides,
  featuredNews,
  joinData,
  pages,
  posts,
  socialMediaInfo,
  headerData,
  footerData,
  teamsCategories,
  mainSponsorsWhite,
  mainSponsorsBlue,
  otherSponsors, //only blue
  schoolTeamData,
  coachesData,
  wheelchairTeamData,
  maleTeamsData,
  maleSeniorTeamData,
  femaleTeamsData,
  femaleSeniorTeamData,
] = await Promise.all([
  //used in @pages/projectes-i-events index and [projectes]
  fetchPostsInCategory(42, COMMON_FIELDS, 100),
  //used in @pages/noticies index and [noticies]
  fetchPostsInCategory(19, COMMON_FIELDS, 100),
  //used in @components/hero
  fetchPostsInCategory(40, ["image", "title", "content"]),
  //used in @components news
  fetchPostsInCategory(41, ["title", "image", "slug", "date", "id"]),
  //used in @components join
  fetchPageBySlug("la-familia-cbg/"),
  //used in @pages [pages] and in @layouts/HeaderLayout for SearchWidget
  fetchPages(100, COMMON_FIELDS),
  fetchPosts(100, ["categories", ...COMMON_FIELDS]),
  //used in @components/ socialMediaMenu.astro and .svelte
  fetchImagesInPageBySlug("xarxes-socials"),
  //used in @layouts/HeaderLayout
  fetchPageBySlug("capcalera", ["content"]),
  //used in @layouts/FooterLayout
  fetchPageBySlug("peu-de-pagina", ["content"]),
  //used in @components/teams
  fetchImagesInPageBySlug("equips"),
  //used in sponsors
  fetchImagesInPageBySlug("patrocinadors-principals-logos-blancs"),
  fetchImagesInPageBySlug("patrocinadors-principals-logos-blaus"),
  fetchImagesInPageBySlug("altres-patrocinadors"),
  //used in pages/equips
  fetchImagesInPageBySlug("escola-de-basquet"),
  fetchImagesInPageBySlug("entrenadors-i-entrenadores"),
  fetchImagesInPageBySlug("basquet-en-cadira-de-rodes"),
  fetchImagesInPageBySlug("equips-masculins"),
  fetchImagesInPageBySlug("jugadors-equip-senior-masculi"),
  fetchImagesInPageBySlug("equips-femenins"),
  fetchImagesInPageBySlug("jugadores-equip-senior-femeni"),
]);
