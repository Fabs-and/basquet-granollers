import type { Replacement } from "../types";

// Regular expressions for various HTML tags and patterns
const divTag = /<div>/g;
const closingDiv = /<\/div>/g;
const imgTag = /<img [^>]*src="([^"]*)"[^>]*>/g;
const imgTagSimple = /<img src="([^"]*)">/g;
const pTagAroundImg = /<p[^>]*>\s*(<img [^>]+>)\s*<\/p>/g;
const ulTag = /<ul([^>]*)>/g;
const olTag = /<ol([^>]*)>/g;
const liTag = /<li([^>]*)>/g;
const pTagStyle = /<p style="[^"]*text-align:[^;]*;?[^"]*">/g;
const aTag = /<a([^>]*)>/g;
export const urlRegex = /(https?:\/\/cbgranollers\.cat\/[^"]*)/g;

// Helper function to replace characters based on provided replacements
export function replaceCharacters(str: string, replacements: Replacement[]): string {
  let result = str;
  for (const { pattern, replacement } of replacements) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// Helper function to replace div tags with p tags and remove text-align style from p tags
export function processParagraphTags(str: string): string {
  let result = str;
  result = result.replace(divTag, "<p>").replace(closingDiv, "</p>");
  result = result.replace(pTagStyle, (match) => match.replace(/text-align:[^;]*;?/g, ""));
  return result;
}

// Helper function to clean up img tags
export function cleanupImgTags(str: string): string {
  let newStr = str.replace(imgTag, (match, p1) => `<img src="${p1}" style="align-self: center;">`);
  newStr = newStr.replace(pTagAroundImg, "$1");
  newStr = newStr.replace(imgTagSimple, (match, p1) => `<img src="${p1}" style="align-self: center;">`);
  newStr = newStr.replace(/<(a|div|p)(?: [^>]*)?>(<img [^>]*>)<\/\1>/g, "$2");
  return newStr;
}

// Helper function to ensure ul, ol, and li have default behaviors
export function styleListTags(str: string): string {
  let newStr = str.replace(ulTag, '<ul$1 style="list-style-type: disc; padding-left: 2em;">');
  newStr = newStr.replace(olTag, '<ol$1 style="list-style-type: decimal; padding-left: 2em;">');
  return newStr.replace(liTag, '<li$1 style="display: list-item;">');
}

// Helper function to handle all modifications to anchor tags
export function modifyAnchorTags(str: string): string {
  let result = str;

  // Set color and text-decoration for anchor tags
  result = result.replace(aTag, '<a$1 style="color: var(--clr-primary); text-decoration: underline">');

  // Handle anchor tags within headings, span or strong tags
  result = result.replace(
    /<(h[1-6]|span|strong)[^>]*>(.*?)<a ([^>]*)>(.*?)<\/a>(.*?)<\/\1>/g,
    (match, tag, before, aAttributes, aContent, after) => {
      return `${before}<a ${aAttributes}>${aContent}</a>${after}`;
    },
  );

  // Update style for anchor tags with existing style attribute
  result = result.replace(/<a([^>]*)style="[^"]*"([^>]*)>(.*?)<\/a>/g, (match, before, after, content) => {
    return `<a${before}${after} class="g-button-anchor-internals">${content}</a>`;
  });

  // Remove > and < characters from anchor tag content
  result = result.replace(/<a([^>]*)>(.*?)<\/a>/g, (match, attributes, content) => {
    const updatedContent = content.replace(/&gt;|&lt;/g, "");
    return `<a${attributes}>${updatedContent}</a>`;
  });

  return result;
}

// Helper function to replace accents with apostrophes
export function replaceAccents(str: string): string {
  return str.replace(/(\b)´(\b)/g, "$1'$2");
}

// Helper function to replace heading tags and adjust capitalization
export function replaceHeadingTags(str: string): string {
  return str.replace(/<(\/?)h([1-6])([^>]*)>(.*?)<\/h\2>/g, (match, closingSlash, level, rest, content) => {
    const newLevel = parseInt(level, 10) + 1;
    if (newLevel <= 6) {
      const strippedContent = content.replace(/<\/?span[^>]*>|<\/?strong[^>]*>/g, "");
      const restWithoutClassOrStyle = rest.replace(/ class="[^"]*"| style="[^"]*"/g, "");
      const className = newLevel === 2 ? "g-h2-internal-page" : "g-headings-internal-page";
      const adjustedContent = strippedContent
        .toLowerCase()
        .replace(/\b\w/g, (char, index) => {
          if (index === 0 || strippedContent.charAt(index - 2) === ".") {
            return char.toUpperCase();
          }
          return char;
        });
      return `<${closingSlash}h${newLevel}${restWithoutClassOrStyle} class="${className}">${adjustedContent}</h${newLevel}>`;
    }
    return match;
  });
}

// Helper function to set iframe width
export function setIframeWidth(str: string): string {
  return str.replace(/<iframe([^>]+)>/g, (match, p1) => {
    const widthAttrMatch = p1.match(/\bwidth="[^"]*"/);
    if (widthAttrMatch) {
      return match.replace(widthAttrMatch[0], 'width="100%"');
    } else {
      return `<iframe width="100%"${p1}>`;
    }
  });
}

// Helper function to replace URLs
export function replaceURLs(str: string): string {
  return str.replace(urlRegex, (match) => {
    return match.replace("cbgranollers.cat", "wordpress.cbgranollers.cat");
  });
}

