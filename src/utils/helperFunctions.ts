// import types
import type { Category } from "fetch-wordpress-api";

import { load } from "cheerio";
// Replace <div> for <p>
export function formatHTMLContent(str: string) {
  // Check if the input is a string
  if (typeof str !== "string") {
    throw new TypeError("Expected a string argument");
  }

  const divTag = /<div>/g;
  const closingDiv = /<\/div>/g;
  const imgTag = /<img [^>]*src="([^"]*)"[^>]*>/g;

  // Convert divs to ps
  let newStr = str;
  if (divTag.test(str) && closingDiv.test(str)) {
    newStr = str.replace(divTag, "<p>").replace(closingDiv, "</p>");
  }

  // Clean up img tags
  if (imgTag.test(newStr)) {
    newStr = newStr.replace(imgTag, (match, p1) => `<img src="${p1}">`);
  }

  // Apply align-self: center to img tags
  const imgTagSimple = /<img src="([^"]*)">/g;
  if (imgTagSimple.test(newStr)) {
    newStr = newStr.replace(
      imgTagSimple,
      '<img style="align-self: center;" src="$1">',
    );
  }

  // Strip p tags from around img tags
  const pTagAroundImg = /<p[^>]*>\s*(<img [^>]+>)\s*<\/p>/g;
  if (pTagAroundImg.test(newStr)) {
    newStr = newStr.replace(pTagAroundImg, "$1");
  }

  // Ensure ul, ol, and li have default behaviors
  const ulTag = /<ul([^>]*)>/g;
  const olTag = /<ol([^>]*)>/g;
  const liTag = /<li([^>]*)>/g;

  if (ulTag.test(newStr)) {
    newStr = newStr.replace(
      ulTag,
      '<ul$1 style="list-style-type: disc; padding-left: 2em;">',
    );
  }

  if (olTag.test(newStr)) {
    newStr = newStr.replace(
      olTag,
      '<ol$1 style="list-style-type: decimal; padding-left: 2em;">',
    );
  }

  if (liTag.test(newStr)) {
    newStr = newStr.replace(liTag, '<li$1 style="display: list-item;">');
  }

  // Remove text-align style from p tags
  const pTagStyle = /<p style="[^"]*text-align:[^;]*;?[^"]*">/g;
  if (pTagStyle.test(newStr)) {
    newStr = newStr.replace(pTagStyle, (match) =>
      match.replace(/text-align:[^;]*;?/g, ""),
    );
  }

  // Set color for anchor tags
  const aTag = /<a([^>]*)>/g;
  if (aTag.test(newStr)) {
    newStr = newStr.replace(
      aTag,
      '<a$1 style="color: var(--clr-primary); text-decoration: underline">',
    );
  }

  // Replace right accents with apostrophes
  if (/\b´\b/g.test(newStr)) {
    newStr = newStr.replace(/(\b)´(\b)/g, "$1'$2");
  }

  // Replace heading tags and adjust capitalization
  newStr = newStr.replace(
    /<(\/?)h([1-6])([^>]*)>(.*?)<\/h\2>/g,
    (match, closingSlash, level, rest, content) => {
      const newLevel = parseInt(level, 10) + 1;
      if (newLevel <= 6) {
        // Strip <span> and <strong> tags from heading content
        const strippedContent = content.replace(
          /<\/?span[^>]*>|<\/?strong[^>]*>/g,
          "",
        );
        // Remove any existing class and style attributes
        const restWithoutClassOrStyle = rest.replace(
          / class="[^"]*"| style="[^"]*"/g,
          "",
        );
        // Determine class based on heading level
        const className =
          newLevel === 2 ? "g-h2-internal-page" : "g-headings-internal-page";
        // Adjust capitalization of heading content
        const adjustedContent = strippedContent
          .toLowerCase()
          .replace(/\b\w/g, (char, index) => {
            // Capitalize the first character of the content and the first character following a period and a space
            if (index === 0 || strippedContent.charAt(index - 2) === ".") {
              return char.toUpperCase();
            }
            return char;
          });
        return `<${closingSlash}h${newLevel}${restWithoutClassOrStyle} class="${className}">${adjustedContent}</h${newLevel}>`;
      }

      return match; // Return the original match if the new level is out of range
    },
  );

  // Pull out anchor tags from headings, span or strong
  newStr = newStr.replace(
    /<(h[1-6]|span|strong)[^>]*>(.*?)<a ([^>]*)>(.*?)<\/a>(.*?)<\/\1>/g,
    (match, tag, before, aAttributes, aContent, after) => {
      return `${before}<a ${aAttributes}>${aContent}</a>${after}`;
    },
  );

  // Remove style from anchor tags and add class "button-anchor"
  newStr = newStr.replace(
    /<a([^>]*) style="[^"]*"([^>]*)>(.*?)<\/a>/g,
    (match, before, after, content) => {
      return `<a${before}${after} class="button-anchor-internals">${content}</a>`;
    },
  );

  // Remove > and < characters from anchor tag content
  newStr = newStr.replace(
    /<a([^>]*)>(.*?)<\/a>/g,
    (match, attributes, content) => {
      // Replace &gt; and &lt; with empty strings to remove them
      const updatedContent = content.replace(/&gt;|&lt;/g, "");
      return `<a${attributes}>${updatedContent}</a>`;
    },
  );

  // Convert anchor tag text to uppercase
  newStr = newStr.replace(
    /<a([^>]*)>(.*?)<\/a>/g,
    (match, attributes, content) => {
      // Convert content to uppercase
      const uppercaseContent = content.toUpperCase();
      return `<a${attributes}>${uppercaseContent}</a>`;
    },
  );

  // Set width to 100% for iframe tags
  newStr = newStr.replace(/<iframe([^>]+)>/g, (match, p1) => {
    // Check if width attribute already exists
    const widthAttrMatch = p1.match(/\bwidth="[^"]*"/);
    if (widthAttrMatch) {
      // Replace value of existing width attribute
      return match.replace(widthAttrMatch[0], 'width="100%"');
    } else {
      // Add width attribute if it doesn't exist
      return `<iframe width="100%"${p1}>`;
    }
  });

  return newStr;
}

export function removeHTMLTags(str: string) {
  const ellipsis = /\[.*?\]/g; // match anything in square brackets
  const emptySpace = /&.*?;/g; // match anything between & and ;
  let newStr;
  if (ellipsis.test(str) || emptySpace.test(str)) {
    newStr = str.replace(ellipsis, "...");
  }
  if (emptySpace.test(str)) str.replace(emptySpace, " ");
  return newStr;
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

export function categoryMapper(
  allCategories: Category[],
  postCategories: number[],
) {
  if (!Array.isArray(allCategories)) return;
  const categories = allCategories.filter(
    (category) => postCategories.indexOf(category.id) !== -1,
  );
  return categories;
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

export function containsWord(str: string, word: string) {
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
    "Navegació (A triar entre totes les pàgines creades. Màxim 6 pàgines)",
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

export function displayButtonHistory(content: string) {
  const regex =
    /<li>\s*<strong>\s*Botó\s+de\s+la\s+història\s*:\s*s[ií]\s*<\/strong>\s*<\/li>/i;
  return regex.test(content);
}

export function displaySearchIcon(content: string) {
  const regex =
    /<li>\s*<strong>\s*Barra\s+de\s+cerca\s*:\s*s[ií]\s*<\/strong>\s*<\/li>/i;
  return regex.test(content);
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
    /(?:&gt;|&nbsp;)*\s*T[ií]tol:\s*<\/strong>\s*(?:&nbsp;)*(.*?)(?:&nbsp;)*(?:<br \/>\n|<\/p>)/gi;
  const priceRegex =
    /(?:&gt;|&nbsp;)*\s*Preu:\s*<\/strong>\s*(?:&nbsp;)*(.*?)(?:&nbsp;)*(?:<br \/>\n|<\/p>)/gi;
  const advantagesRegex =
    /(?:&gt;|&nbsp;)*\s*Avantatges:\s*(?:<\/strong>\s*<br \/>\s*\n|<br \/>\s*\n\s*<\/strong>)([\s\S]*?)(?:&nbsp;)*<\/p>/gis;
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
      const imageAlt = addApostrophe(imageAltMatch[1]);
      const title = addApostrophe(titleMatch[1]);
      const price = addApostrophe(priceMatch[1]);
      const advantages = addApostrophe(advantagesMatch[1]).split("<br />\n");

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
    /(?:&gt;|&nbsp;)*\s*T[ií]tol:\s*<\/strong>\s*(?:&nbsp;)*(.*?)(?:&nbsp;)*(?:<br \/>\n|<\/p>)/gi;
  const priceRegex =
    /(?:&gt;|&nbsp;)*\s*Preu:\s*<\/strong>\s*(?:&nbsp;)*(.*?)(?:&nbsp;)*(?:<br \/>\n|<\/p>)/gi;
  const advantagesRegex =
    /(?:&gt;|&nbsp;)*\s*Avantatges:\s*(?:<\/strong>\s*<br \/>\s*\n|<br \/>\s*\n\s*<\/strong>)([\s\S]*?)(?:&nbsp;)*<\/p>/gis;
  const sponsorshipsStart = content.indexOf("MEMBRES");
  const membershipsEnd = content.length;
  const sponsorshipsSection = content.slice(sponsorshipsStart, membershipsEnd);

  let sponsorships = [];

  let match;
  while ((match = titleRegex.exec(sponsorshipsSection)) !== null) {
    const title = addApostrophe(match[1]);
    const priceMatch = priceRegex.exec(sponsorshipsSection);
    const advantagesMatch = advantagesRegex.exec(sponsorshipsSection);

    if (priceMatch && advantagesMatch) {
      const price = addApostrophe(priceMatch[1]);
      const advantages = addApostrophe(advantagesMatch[1]).split("<br />\n");

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
