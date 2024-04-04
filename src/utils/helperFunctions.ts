import {
  replaceCharacters,
  processParagraphTags,
  cleanupImgTags,
  styleListTags,
  modifyAnchorTags,
  replaceAccents,
  replaceHeadingTags,
  setIframeWidth,
  replaceURLs,
  urlRegex,
} from "./helpersHelpers";

import type { DescriptionAndLink } from "../types";

// String manipulation functions
export function stripHtml(str: string) {
  return str.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ");
}

export function addApostrophe(str: string) {
  return str.replace(/&#8217;/g, "'");
}

export function truncateString(str: string) {
  if (str.length <= 198) {
    return str;
  }

  let truncated = str.slice(0, 198);
  let lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex !== -1) {
    truncated = truncated.slice(0, lastSpaceIndex);
  }
  return truncated.trim() + "...";
}

// HTML formatting functions
export function formatHtml(str: string) {
  // Check if the input is a string
  if (typeof str !== "string") {
    console.error("Expected a string argument, received:", typeof str);
    return "";
  }
  let newStr = str;
  if (/&#215;|&#8217;/.test(str)) {
    newStr = replaceCharacters(str, [
      { pattern: /&#215;/g, replacement: "x" },
      { pattern: /&#8217;/g, replacement: "'" },
    ]);
  }

  // Call each helper function in sequence with checks
  newStr = processParagraphTags(newStr);

  if (/img/.test(newStr)) {
    newStr = cleanupImgTags(newStr);
  }

  if (/(ul|ol|li)/.test(newStr)) {
    newStr = styleListTags(newStr);
  }

  if (/a/.test(newStr)) {
    newStr = modifyAnchorTags(newStr);
  }

  newStr = replaceAccents(newStr);
  newStr = replaceHeadingTags(newStr);

  if (/iframe/.test(newStr)) {
    newStr = setIframeWidth(newStr);
  }

  if (urlRegex.test(newStr)) {
    newStr = replaceURLs(newStr);
  }

  return newStr;
}

// Date-related functions
export function dateConverter(date: string | Date) {
  const newDate = typeof date === "string" ? new Date(date) : date;
  return `${new Intl.DateTimeFormat("ca", { day: "numeric" }).format(
    newDate,
  )}.${new Intl.DateTimeFormat("ca", { month: "numeric" }).format(
    newDate,
  )}.${new Intl.DateTimeFormat("ca", { year: "numeric" }).format(newDate)}`;
}

export function lastYearsNews(str: string) {
  const date = new Date(str).getTime();
  const currentYear = new Date();
  const aYearAgo = currentYear.getTime() - 31536000000;
  return date > aYearAgo;
}

export function getSeasonYears() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  let firstYear, secondYear;

  if (currentMonth >= 9) {
    firstYear = currentYear.toString().slice(-2);
    secondYear = (currentYear + 1).toString().slice(-2);
  } else {
    firstYear = (currentYear - 1).toString().slice(-2);
    secondYear = currentYear.toString().slice(-2);
  }

  return {
    firstYear: firstYear,
    secondYear: secondYear,
  };
}

// DOM-related functions
export function toggleDialog() {
  const dialog = document.querySelector("dialog");
  if (dialog) {
    dialog.open ? dialog.close() : dialog.showModal();
  }
}

// Miscellaneous functions
export function titleSlugMapper(str: string, word: string) {
  const regex = new RegExp(`\\b${word}\\b`, "i");
  return regex.test(str);
}

export function extractSlideDescriptionAndLink(
  str: string,
): DescriptionAndLink {
  const descriptionMatch = str.match(
    /<strong>\s*Descripci[oó]\s*:\s*(?:&nbsp;)?\s*<\/strong>\s*(.+?)\s*<\/p>/i,
  );
  const linkMatch = str.match(
    /<strong>\s*Link\s+a\s+la\s+p[aà]gina\s+o\s+post:\s*<\/strong>\s*(.+?)\s*<\/p>/i,
  );

  return {
    description: descriptionMatch ? descriptionMatch[1].trim() : null,
    link: linkMatch ? linkMatch[1].trim() : null,
  };
}
