import {
  fetchImagesInPageBySlug,
  fetchPageBySlug,
  fetchPages,
  fetchPosts,
  fetchPostsInCategories,
} from "@utils/apiFunctions";

import type { Post } from "../types";
import {
  PAGE_FIELDS,
  PROJECTS_CATEGORY_ID,
  NEWS_CATEGORY_ID,
  HERO_SLIDES_CATEGORY_ID,
  PROJECTS_AND_HERO_SLIDES_FIELDS,
  CONFIG_PAGES,
  TEAM_PAGES,
  POST_FIELDS,
  COMMON_FIELDS,
} from "./globalConstants";

export const [
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
  fetchPages(100, PAGE_FIELDS),
  fetchPosts(100, POST_FIELDS),
  fetchPostsInCategories(
    [PROJECTS_CATEGORY_ID, HERO_SLIDES_CATEGORY_ID],
    PROJECTS_AND_HERO_SLIDES_FIELDS,
    100,
  ),
  fetchPostsInCategories([NEWS_CATEGORY_ID], POST_FIELDS, 100),
  //Fetching of Config pages
  fetchPageBySlug(CONFIG_PAGES.homePageJoinSection, ["content"]),
  fetchImagesInPageBySlug(CONFIG_PAGES.socialMedia),
  fetchPageBySlug(CONFIG_PAGES.header, ["content"]),
  fetchPageBySlug(CONFIG_PAGES.footer, ["content"]),
  fetchImagesInPageBySlug(CONFIG_PAGES.homePageMainSponsorsWhite),
  fetchImagesInPageBySlug(CONFIG_PAGES.homePageMainSponsorsBlue),
  fetchImagesInPageBySlug(CONFIG_PAGES.homePageOtherSponsors),
  fetchImagesInPageBySlug(TEAM_PAGES.allTeams),
  fetchImagesInPageBySlug(TEAM_PAGES.school),
  fetchImagesInPageBySlug(TEAM_PAGES.coaches),
  fetchImagesInPageBySlug(TEAM_PAGES.wheelchair),
  fetchImagesInPageBySlug(TEAM_PAGES.maleTeams),
  fetchImagesInPageBySlug(TEAM_PAGES.maleSenior),
  fetchImagesInPageBySlug(TEAM_PAGES.femaleTeams),
  fetchImagesInPageBySlug(TEAM_PAGES.femaleSenior),
]);

async function initializePostTypes(

  projectsAndHeroSlides: Post[],
) {
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
export const {projects, heroSlides } = await initializePostTypes(
  projectsAndHeroSlides,
);
