// import types
import type { Category } from "fetch-wordpress-api";

// Replace <div> for <p>
export function formatHTMLContent(str: string) {
  const divTag = /<div>/g;
  const closingDiv = /<\/div>/g;
  const imgTag = /<img [^>]*src="([^"]*)"[^>]*>/g;

  // Convert divs to ps
  let newStr = str.replace(divTag, "<p>").replace(closingDiv, "</p>");

  // Clean up img tags
  newStr = newStr.replace(imgTag, (match, p1) => `<img src="${p1}">`);

  // Apply align-self: center to img tags
  newStr = newStr.replace(
    /<img src="([^"]*)">/g,
    '<img style="align-self: center;" src="$1">',
  );

  // Strip p tags from around img tags
  newStr = newStr.replace(/<p[^>]*>\s*(<img [^>]+>)\s*<\/p>/g, "$1");

  // Ensure ul, ol, and li have default behaviors
  newStr = newStr.replace(
    /<ul([^>]*)>/g,
    '<ul$1 style="list-style-type: disc; padding-left: 2em;">',
  );

  newStr = newStr.replace(
    /<ol([^>]*)>/g,
    '<ol$1 style="list-style-type: decimal; padding-left: 2em;">',
  );

  newStr = newStr.replace(/<li([^>]*)>/g, '<li$1 style="display: list-item;">');

  // Remove text-align style from p tags
  newStr = newStr.replace(
    /<p style="[^"]*text-align:[^;]*;?[^"]*">/g,
    (match) => match.replace(/text-align:[^;]*;?/g, ""),
  );

  // Set color for anchor tags
  newStr = newStr.replace(
    /<a([^>]*)>/g,
    '<a$1 style="color: var(--clr-primary); text-decoration: underline">',
  );

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
