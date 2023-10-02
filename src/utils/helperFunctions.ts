// import types
import type { Category } from 'fetch-wordpress-api';

// Replace <div> for <p>
export function divForP(str: string) {
  const openDiv = /<div>/g;
  const closingDiv = /<\/div>/g;
  let newStr;
  if (openDiv.test(str)) {
    newStr = str.replace(openDiv, '<p>').replace(closingDiv, '</p>');
    return newStr;
  } else {
    return str;
  }
}

export function removeHTMLTags(str: string) {
  const ellipsis = /\[.*?\]/g; // match anything in square brackets
  const emptySpace = /&.*?;/g; // match anything between & and ;
  let newStr;
  if (ellipsis.test(str) || emptySpace.test(str)) {
    newStr = str.replace(ellipsis, '...');
  }
  if (emptySpace.test(str)) str.replace(emptySpace, ' ');
  return newStr;
}

export function dateConverter(date: string | null | Date) {
  let newDate;
  if (typeof date === 'string') newDate = new Date(date);
  else if (date !== null) newDate = date;
  else {
    const error = new Error('Invalid Parameter');
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
  postCategories: number[]
) {
  if (!Array.isArray(allCategories)) return;
  const categories = allCategories.filter(
    (category) => postCategories.indexOf(category.id) !== -1
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

