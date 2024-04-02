//Import types
import { get } from "http";
import type { Post } from "../types";

//Import constants
import {
  PAGE_FIELDS,
  PROJECTS_CATEGORY_ID,
  NEWS_CATEGORY_ID,
  HERO_SLIDES_CATEGORY_ID,
  PROJECTS_FIELDS,
  CONFIG_PAGES,
  TEAM_PAGES,
  POST_FIELDS,
} from "./globalConstants";

//Import apiFunctions
import {
  getCapcalera,
  getFamiliaSection,
  getFamiliaSectionContactaMessage,
  getFooter,
  getHeroSlides,
  getImagesBySlug,
  getPageBySlug,
  getPageSectionTitles,
  getPages,
  getPosts,
  getPostsInCategories,
  getSeniorTeamsData,
  getSocialMedia,
} from "@services/apiFunctions";

//Import functions
import {
  extractBottomFooterInfo,
  extractTopFooterInfo,
} from "@utils/helperFunctions";

export const [
  header,
  footer,
  socialMedia,
  pageSectionTitles,
  hSlides,
  familiaSection,
  familiaContactaMessage,
  pages,
  posts,
  projectsData,
  allNews,
  mainSponsorsWhite,
  mainSponsorsBlue,
  otherSponsors,
  teamsCategories,
  seniorTeamsData,
  schoolTeamImage,
  schoolTeamTitle,
  coachesImage,
  coachesTitle,
  wheelchairTeamImage,
  wheelchairTeamTitle,
  maleTeamsImage,
  maleTeamsTitle,
  femaleTeamsImage,
  femaleTeamsTitle,
] = await Promise.all([
  getCapcalera(),
  getFooter(),
  getSocialMedia(),
  getPageSectionTitles(),
  getHeroSlides(),
  getFamiliaSection(),
  getFamiliaSectionContactaMessage(),
  getPages(100, PAGE_FIELDS),
  getPosts(100, POST_FIELDS),
  getPostsInCategories(
    [PROJECTS_CATEGORY_ID],
    PROJECTS_FIELDS,
    100,
  ),
  getPostsInCategories([NEWS_CATEGORY_ID], POST_FIELDS, 100),
  getImagesBySlug(CONFIG_PAGES.homePageMainSponsorsWhite),
  getImagesBySlug(CONFIG_PAGES.homePageMainSponsorsBlue),
  getImagesBySlug(CONFIG_PAGES.homePageOtherSponsors),
  getImagesBySlug(TEAM_PAGES.allTeams),
  getSeniorTeamsData(),
  getImagesBySlug(TEAM_PAGES.school),
  getPageBySlug(TEAM_PAGES.school, ["title"]),
  getImagesBySlug(TEAM_PAGES.coaches),
  getPageBySlug(TEAM_PAGES.coaches, ["title"]),
  getImagesBySlug(TEAM_PAGES.wheelchair),
  getPageBySlug(TEAM_PAGES.wheelchair, ["title"]),
  getImagesBySlug(TEAM_PAGES.maleTeams),
  getPageBySlug(TEAM_PAGES.maleTeams, ["title"]),
  getImagesBySlug(TEAM_PAGES.femaleTeams),
  getPageBySlug(TEAM_PAGES.femaleTeams, ["title"]),
]);
