//Import types
import type { Post } from "../types";

//Import constants
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

//Import apiFunctions
import {
  getCapcalera,
  getImagesBySlug,
  getPageBySlug,
  getPages,
  getPosts,
  getPostsInCategories,
} from "@services/apiFunctions";

//Import functions
import {
  extractBottomFooterInfo,
  extractTopFooterInfo,
} from "@utils/helperFunctions";

export const [
  header,
  pages,
  posts,
  projectsAndHeroSlides,
  allNews,
  joinData,
  socialMediaInfo,
  headerData,
  footerData,
  mainSponsorsWhite,
  mainSponsorsBlue,
  otherSponsors, //only blue
  teamsCategories,
  schoolTeamData,
  coachesData,
  wheelchairTeamData,
  maleTeamsData,
  maleSeniorTeamData,
  femaleTeamsData,
  femaleSeniorTeamData,
] = await Promise.all([
  getCapcalera(),
  getPages(100, PAGE_FIELDS),
  getPosts(100, POST_FIELDS),
  getPostsInCategories(
    [PROJECTS_CATEGORY_ID, HERO_SLIDES_CATEGORY_ID],
    PROJECTS_AND_HERO_SLIDES_FIELDS,
    100,
  ),
  getPostsInCategories([NEWS_CATEGORY_ID], POST_FIELDS, 100),
  getPageBySlug(CONFIG_PAGES.homePageJoinSection, ["content"]),
  getImagesBySlug(CONFIG_PAGES.socialMedia),
  getPageBySlug(CONFIG_PAGES.header, ["content"]),
  getPageBySlug(CONFIG_PAGES.footer, ["content"]),
  getImagesBySlug(CONFIG_PAGES.homePageMainSponsorsWhite),
  getImagesBySlug(CONFIG_PAGES.homePageMainSponsorsBlue),
  getImagesBySlug(CONFIG_PAGES.homePageOtherSponsors),
  getImagesBySlug(TEAM_PAGES.allTeams),
  getImagesBySlug(TEAM_PAGES.school),
  getImagesBySlug(TEAM_PAGES.coaches),
  getImagesBySlug(TEAM_PAGES.wheelchair),
  getImagesBySlug(TEAM_PAGES.maleTeams),
  getImagesBySlug(TEAM_PAGES.maleSenior),
  getImagesBySlug(TEAM_PAGES.femaleTeams),
  getImagesBySlug(TEAM_PAGES.femaleSenior),
]);

async function initializePostTypes(projectsAndHeroSlides: Post[]) {
  let projects: Post[] = [];
  let heroSlides: Post[] = [];

  for (let i = 0; i < projectsAndHeroSlides.length; i++) {
    if (Array.isArray(projectsAndHeroSlides[i].categories)) {
      if (
        projectsAndHeroSlides[i].categories.includes(HERO_SLIDES_CATEGORY_ID)
      ) {
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
export const { projects, heroSlides } = await initializePostTypes(
  projectsAndHeroSlides,
);

const {
  content: { rendered: footerContent },
} = footerData[0];

const topFooterContent = extractTopFooterInfo(footerContent);

export const { generalLinks, fixedLinks } = topFooterContent;

export const bottomFooterLinks = extractBottomFooterInfo(footerContent);

