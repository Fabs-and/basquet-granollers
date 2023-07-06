// import types
import type { Category } from 'src/types';

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

export function dateConverter(date: Date) {
  const newDate = new Date(date);
  return `${new Intl.DateTimeFormat('ca', { month: 'long' }).format(
    newDate
  )} ${new Intl.DateTimeFormat('ca', { day: 'numeric' }).format(
    newDate
  )}, ${new Intl.DateTimeFormat('ca', { year: 'numeric' }).format(newDate)}`;
}

export function categoryMapper(
  allCategories: Category[],
  postCategories: number[]
) {
  const categories = allCategories.filter(
    (category) => postCategories.indexOf(category.id) !== -1
  );
  return categories;
}

