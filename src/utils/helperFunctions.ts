import { strictEqual } from 'assert';
import { getFromAPI } from './api';
import { CategoryFields, Endpoints } from 'src/types';

let ellipsis = /\[.*?\]/g; // match anything in square brackets
let emptySpace = /&.*?;/g; // match anything between & and ;
let openDiv = /<div>/g;
let closingDiv = /<\/div>/g;

export function removeHTMLEntity(str: string) {
  let newStr;
  if (ellipsis.test(str) || emptySpace.test(str)) {
    console.log('trueeeee');
    newStr = str.replace(ellipsis, '...');
  }
  if (emptySpace.test(str)) str.replace(emptySpace, ' ');
  return newStr;
}

export function divForP(str: string) {
  let newStr;
  if (openDiv.test(str)) {
    newStr = str.replace(openDiv, '<p>').replace(closingDiv, '</p>');
    return newStr;
  } else {
    return str;
  }
}

export function dateConverter(date: string) {
  const newDate = new Date(date);
  return `${new Intl.DateTimeFormat('ca', { month: 'long' }).format(
    newDate
  )} ${new Intl.DateTimeFormat('ca', { day: 'numeric' }).format(
    newDate
  )}, ${new Intl.DateTimeFormat('ca', { year: 'numeric' }).format(newDate)}`;
}

export function categoryMapper(allCategories, postCategories: number[]) {
  const categories = allCategories.filter(category => postCategories.indexOf(category.id) !== -1);
  return categories;
}