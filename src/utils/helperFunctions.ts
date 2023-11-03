// Replace <div> for <p>
import { replaceCharacters, processParagraphTags, cleanupImgTags,styleListTags, modifyAnchorTags, replaceAccents, replaceHeadingTags, setIframeWidth, replaceURLs, urlRegex  } from "./helpersHelpers";


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


export function stripHtml(str: string) {
  return str.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ");
}

export function dateConverter(date: string | null | Date) {
  let newDate;
  if (typeof date === "string") newDate = new Date(date);
  else if (date !== null) newDate = date;
  else {
    const error = new Error("Invalid Parameter");
    console.error(error); // log the error in the console
    throw error; // throw the error to the caller
  }
  return `${new Intl.DateTimeFormat("ca", { day: "numeric" }).format(
    newDate,
  )}.${new Intl.DateTimeFormat("ca", { month: "numeric" }).format(
    newDate,
  )}.${new Intl.DateTimeFormat("ca", { year: "numeric" }).format(newDate)}`;
}

export function toggleDialog() {
  const dialog = document.querySelector("dialog");
  if (dialog === null) return;
  if (dialog.open) {
    dialog.close();
  } else {
    dialog.showModal();
  }
}

export function titleSlugMapper(str: string, word: string) {
  const regex = new RegExp(`\\b${word}\\b`, "i");
  return regex.test(str);
}

/*For internal pages*/
export function extractSubheading(str: string) {
  // Use a regular expression to match the desired content
  const match = str.match(/Subtítol:&nbsp;(.+?)<\/p>/);

  // If there's no match, return null immediately
  if (!match) return null;

  // Extract the matched content
  return match[1].replace(/&nbsp;/g, " ").trim();
}

/*Home page*/
export function extractTopHeaderContent(str: string) {
  const text1Match = str.match(/Text1:\s*(.+?)<br/);
  const link1Match = str.match(/Link1:\s*(.+?)<\/p>/);
  const text2Match = str.match(/Text2:\s*(.+?)<br/);
  const link2Match = str.match(/Link2:\s*(.+?)<\/p>/);

  if (!text1Match && !text2Match) return null;

  return [
    {
      text1: text1Match ? text1Match[1].trim() : null,
      link1: link1Match ? link1Match[1].trim() : null,
    },
    {
      text2: text2Match ? text2Match[1].trim() : null,
      link2: link2Match ? link2Match[1].trim() : null,
    },
  ];
}

export interface NavItem {
  name: string;
  link?: string;
  dropdown?: NavItem[];
}

export function extractNavigation(content: string): NavItem[] {
  // Updated regular expression to match each line in the navigation section
  const regex =
    /(?:&gt;)?\s*nom:\s*(.*?)(?:,\s*link:\s*(.*?))?(?:<br \/>\n|<\/p>)/gi;
  let match;
  const navigation: NavItem[] = [];
  let currentDropdown: NavItem | null = null;

  // Find the navigation section between "Navegació" and "Botó de la història"
  const navStart = content.indexOf(
    "Navegació (A triar entre totes les pàgines creades)",
  );
  const navEnd = content.indexOf("Botó de la història: si");
  const navSection = content.slice(navStart, navEnd);

  // Iterate through all matches of the regex
  while ((match = regex.exec(navSection)) !== null) {
    const fullMatch = match[0];
    const name = match[1].trim();
    const link = match[2] ? match[2].trim() : "";

    if (fullMatch.startsWith("&gt;")) {
      // It's a dropdown item
      const dropdownItem = { name, link };
      if (currentDropdown && currentDropdown.dropdown) {
        currentDropdown.dropdown.push(dropdownItem);
      }
    } else {
      // It's a main navigation item
      if (link) {
        // It's a regular nav item
        navigation.push({ name, link });
        currentDropdown = null; // Reset the current dropdown
      } else {
        // It's a dropdown label
        currentDropdown = { name, dropdown: [] };
        navigation.push(currentDropdown);
      }
    }
  }

  return navigation;
}


export interface DescriptionAndLink {
  description: string | null;
  link: string | null;
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

export function addApostrophe(str: string) {
  return str.replace(/&#8217;/g, "'");
}

export function extractMembershipsOptions(content: string) {
  const imageURLRegex = /src="([^"]*)"/gi;
  const imageAltRegex = /alt="([^"]*)"/gi;
  const titleRegex =
    /T[ií]tol:\s*(?:<\/?[^>]*>|&nbsp;)*\s*(.*?)(?:\s*<\/?[^>]*>|&nbsp;)*\s*(?:<br \/>\n|<\/p>|<p>)/gi;
  const priceRegex =
    /Preu:\s*(?:<\/?[^>]*>|&nbsp;)*\s*(.*?)(?:\s*<\/?[^>]*>|&nbsp;)*\s*(?:<br \/>\n|<\/p>|<p>)/gi;
  const advantagesRegex =
    /Avantatges:\s*(?:<\/?[^>]*>|&nbsp;)*\s*([\s\S]*?)(?=(?:Imatge:|$))/gi;

  const membershipsStart = content.indexOf("MEMBRES");
  const membershipsEnd = content.indexOf("SPONSORS");
  const membershipsSection = content.slice(membershipsStart, membershipsEnd);

  let memberships = [];

  let match;
  while ((match = imageURLRegex.exec(membershipsSection)) !== null) {
    const imageURL = match[1];
    const imageAltMatch = imageAltRegex.exec(membershipsSection);
    const titleMatch = titleRegex.exec(membershipsSection);
    const priceMatch = priceRegex.exec(membershipsSection);
    const advantagesMatch = advantagesRegex.exec(membershipsSection);

    if (imageAltMatch && titleMatch && priceMatch && advantagesMatch) {
      let advantagesContent = advantagesMatch[1];

      // Remove all HTML tags
      advantagesContent = advantagesContent.replace(/<\/?[^>]+(>|$)/g, "");

      // Remove newline characters at the beginning and end of the string, and replace &nbsp; with a space
      advantagesContent = advantagesContent.replace(/^\n+|\n+$|&nbsp;/g, "");

      const imageAlt = addApostrophe(imageAltMatch[1]);
      const title = addApostrophe(titleMatch[1]);
      const price = addApostrophe(priceMatch[1]);
      const advantages = addApostrophe(advantagesContent)
        .split("\n")
        .filter((line) => line.trim() !== "");

      memberships.push({
        image: { url: imageURL, alt: imageAlt },
        title,
        price,
        advantages,
      });
    }
  }

  return memberships;
}

export function extractSponsorshipsOptions(content: string) {
  const titleRegex =
    /T[ií]tol:\s*(?:<\/?[^>]*>|&nbsp;)*\s*(.*?)(?:\s*<\/?[^>]*>|&nbsp;)*\s*(?:<br \/>\n|<\/p>|<p>)/gi;
  const priceRegex =
    /Preu:\s*(?:<\/?[^>]*>|&nbsp;)*\s*(.*?)(?:\s*<\/?[^>]*>|&nbsp;)*\s*(?:<br \/>\n|<\/p>|<p>)/gi;
  const advantagesRegex =
    /Avantatges:\s*(?:<\/?[^>]*>|&nbsp;)*\s*([\s\S]*?)(?=(?:T[ií]tol:|$))/gi;

  const sponsorshipsStart = content.indexOf("SPONSORS");
  const membershipsEnd = content.length;
  const sponsorshipsSection = content.slice(sponsorshipsStart, membershipsEnd);

  let sponsorships = [];

  let match;
  while ((match = titleRegex.exec(sponsorshipsSection)) !== null) {
    const title = addApostrophe(match[1]);
    const priceMatch = priceRegex.exec(sponsorshipsSection);
    const advantagesMatch = advantagesRegex.exec(sponsorshipsSection);

    if (priceMatch && advantagesMatch) {
      let advantagesContent = advantagesMatch[1];

      // Remove all HTML tags
      advantagesContent = advantagesContent.replace(/<\/?[^>]+(>|$)/g, "");

      // Remove newline characters at the beginning and end of the string, and replace &nbsp; with a space
      advantagesContent = advantagesContent.replace(/^\n+|\n+$|&nbsp;/g, "");
      const price = addApostrophe(priceMatch[1]);
      const advantages = addApostrophe(advantagesContent)
        .split("\n")
        .filter((line) => line.trim() !== "");

      sponsorships.push({ title, price, advantages });
    }
  }
  return sponsorships;
}

//Regex for the next two functions
const sectionRegex =
  /T[ií]tol:(?:\s|&nbsp;)*<\/strong>(?:\s|&nbsp;)*(.*?)(?:\s|&nbsp;)*<\/p>([\s\S]*?)(?=<p><strong>(?:\s|&nbsp;)*T[ií]tol:|<ul>|$)/gis;
const nameLinkRegex =
  /Nom:(?:\s|&nbsp;)*<\/strong>(?:\s|&nbsp;)*(.*?)(?:\s|&nbsp;)*<strong>, Link:(?:\s|&nbsp;)*<\/strong>(?:\s|&nbsp;)*(.*?)(?:\s|&nbsp;)*<\/p>/gis;

export function extractTopFooterInfo(content: string) {
  const generalLinksStart = content.indexOf(
    "Links Generals (Fins a tres elements)",
  );
  const generalLinksEnd = content.indexOf("Links Fixes");
  const generalLinksSection = content.slice(generalLinksStart, generalLinksEnd);

  const generalLinks = [];

  for (const sectionMatch of generalLinksSection.matchAll(sectionRegex)) {
    const sectionTitle = addApostrophe(sectionMatch[1]);
    const sectionContent = sectionMatch[2];
    const contentItems = [];

    for (const nameLinkMatch of sectionContent.matchAll(nameLinkRegex)) {
      contentItems.push({
        name: addApostrophe(nameLinkMatch[1]),
        link: addApostrophe(nameLinkMatch[2]),
      });
    }

    generalLinks.push({ title: sectionTitle, content: contentItems });
  }

  const fixedLinksStart = content.indexOf("Links Fixes");
  const fixedLinksEnd = content.indexOf("PEU DE PÀGINA INFERIOR");

  const fixedLinksSection = content.slice(fixedLinksStart, fixedLinksEnd);

  const fixedLinks = [];

  for (const nameLinkMatch of fixedLinksSection.matchAll(nameLinkRegex)) {
    fixedLinks.push({
      name: addApostrophe(nameLinkMatch[1]),
      link: addApostrophe(nameLinkMatch[2]),
    });
  }

  return { generalLinks, fixedLinks };
}

export function extractBottomFooterInfo(content: string) {
  const linksStart = content.indexOf("PEU DE PÀGINA INFERIOR");
  const linksEnd = content.length;

  const linksSection = content.slice(linksStart, linksEnd);

  const links = [];

  for (const nameLinkMatch of linksSection.matchAll(nameLinkRegex)) {
    links.push({
      name: addApostrophe(nameLinkMatch[1]),
      link: addApostrophe(nameLinkMatch[2]),
    });
  }

  return links;
}

export function extractPlayerInfo(str: string) {
  if (str === "") return "";
  // Define regular expressions to match the desired parts of the string
  const nameRegex = /Nom:\s(.*?)\sPosició:/;
  const positionRegex = /Posició:\s(.*)/;

  // Execute the regular expressions on the input string
  const nameMatch = nameRegex.exec(str);
  const positionMatch = positionRegex.exec(str);

  // If both matches are successful, create and return the desired object
  if (nameMatch && positionMatch) {
    return {
      name: nameMatch[1],
      position: positionMatch[1],
    };
  } else {
    throw new Error("Invalid input string format");
  }
}

export function updateUrltoSubdomain(htmlContent: string): string {
  const urlRegex = /https:\/\/cbgranollers\.cat\/([^"]+)/g;
  return htmlContent.replace(urlRegex, "https://wordpress.cbgranollers.cat/$1");
}

export function lastYearsNews(str: string) {
  const date = new Date(str).getTime();
  const currentYear = new Date();
  const aYearAgo = currentYear.getTime() - 31536000000;
  return date > aYearAgo;
}

export function truncateString(str: string) {
  if (str.length <= 198) {
    return str;
  }

  let truncated = str.slice(0, 198);

  // Find the index of the last space character in the truncated string
  let lastSpaceIndex = truncated.lastIndexOf(" ");

  // If a space character is found, truncate the string to end at this last space
  if (lastSpaceIndex !== -1) {
    truncated = truncated.slice(0, lastSpaceIndex);
  }
  //Trim in case the content starts with empty spaces
  return truncated.trim() + "...";
}
