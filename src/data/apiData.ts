// Import types
import type { Post } from "../types";

// Import constants
import {
  PAGE_FIELDS,
  PROJECTS_CATEGORY_ID,
  NEWS_CATEGORY_ID,
  HERO_SLIDES_CATEGORY_ID,
  PROJECTS_AND_HERO_SLIDES_FIELDS,
  CONFIG_PAGES,
  TEAM_PAGES,
  POST_FIELDS,
} from "./globalConstants";

// Import apiFunctions
import {
  getImagesBySlug,
  getPageBySlug,
  getPages,
  getPosts,
  getPostsInCategories,
} from "@services/apiFunctions";

// Import functions
import {
  extractBottomFooterInfo,
  extractTopFooterInfo,
} from "@utils/helperFunctions";

export let pages = await getPages(100, PAGE_FIELDS);
export let posts = await getPosts(100, POST_FIELDS);
export let projectsAndHeroSlides = await getPostsInCategories(
  [PROJECTS_CATEGORY_ID, HERO_SLIDES_CATEGORY_ID],
  PROJECTS_AND_HERO_SLIDES_FIELDS,
  100,
);
export let allNews = await getPostsInCategories([NEWS_CATEGORY_ID], POST_FIELDS, 100);
export let joinData = await getPageBySlug(CONFIG_PAGES.homePageJoinSection, ["content"]);
export let socialMediaInfo = await getImagesBySlug(CONFIG_PAGES.socialMedia);
export let headerData = await getPageBySlug(CONFIG_PAGES.header, ["content"]);
export let footerData = await getPageBySlug(CONFIG_PAGES.footer, ["content"]);
export let mainSponsorsWhite = await getImagesBySlug(CONFIG_PAGES.homePageMainSponsorsWhite);
export let mainSponsorsBlue = await getImagesBySlug(CONFIG_PAGES.homePageMainSponsorsBlue);
export let otherSponsors = await getImagesBySlug(CONFIG_PAGES.homePageOtherSponsors);
export let teamsCategories = await getImagesBySlug(TEAM_PAGES.allTeams);
export let schoolTeamData = await getImagesBySlug(TEAM_PAGES.school);
export let coachesData = await getImagesBySlug(TEAM_PAGES.coaches);
export let wheelchairTeamData = await getImagesBySlug(TEAM_PAGES.wheelchair);
export let maleTeamsData = await getImagesBySlug(TEAM_PAGES.maleTeams);
export let maleSeniorTeamData = await getImagesBySlug(TEAM_PAGES.maleSenior);
export let femaleTeamsData = await getImagesBySlug(TEAM_PAGES.femaleTeams);
export let femaleSeniorTeamData = await getImagesBySlug(TEAM_PAGES.femaleSenior);

async function initializePostTypes(projectsAndHeroSlides: Post[]) {
  let projects: Post[] = [];
  let heroSlides: Post[] = [];

  for (let i = 0; i < projectsAndHeroSlides.length; i++) {
    if (Array.isArray(projectsAndHeroSlides[i].categories)) {
      if (projectsAndHeroSlides[i].categories.includes(HERO_SLIDES_CATEGORY_ID)) {
        heroSlides.push(projectsAndHeroSlides[i]);
      } else {
        projects.push(projectsAndHeroSlides[i]);
      }
    }
  }

  return {
    projects,
    heroSlides,
  };
}

export const { projects, heroSlides } = await initializePostTypes(projectsAndHeroSlides);

const {
  content: { rendered: footerContent },
} = footerData[0];

const topFooterContent = extractTopFooterInfo(footerContent);
export const { generalLinks, fixedLinks } = topFooterContent;
export const bottomFooterLinks = extractBottomFooterInfo(footerContent);