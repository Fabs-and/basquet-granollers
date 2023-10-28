import {
  fetchImagesInPageBySlug,
  fetchPageBySlug,
  fetchPages,
  fetchPosts,
  fetchPostsInCategories,
} from "@utils/apiFunctions";

import type { Post } from "../types";
import {
  COMMON_FIELDS,
  PROJECTS_CATEGORY_ID,
  NEWS_CATEGORY_ID,
  HERO_SLIDES_CATEGORY_ID,
  FEATURED_NEWS_CATEGORY_ID,
} from "./globalConstants";

export const [
  projects,
  allNews,
  heroSlides,
  // featuredNews,
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
  fetchPostsInCategories([PROJECTS_CATEGORY_ID], COMMON_FIELDS, 100),
  //used in @pages/noticies index and [noticies]
  fetchPostsInCategories(
    [FEATURED_NEWS_CATEGORY_ID, NEWS_CATEGORY_ID],
    COMMON_FIELDS,
    100,
  ),
  //used in @components/hero
  fetchPostsInCategories(
    [HERO_SLIDES_CATEGORY_ID],
    ["image", "title", "content"],
  ),
  //used in @components news
  // fetchPostsInCategories([FEATURED_NEWS_CATEGORY_ID], ["title", "image", "slug", "date", "id"]),
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

export let news: Post[] = [];
export let featuredNews: Post[] = [];

for (let oneNews of allNews) {
  if (oneNews.categories.includes(FEATURED_NEWS_CATEGORY_ID)) {
    featuredNews.push(oneNews);
  } else {
    news.push(oneNews);
  }
}
