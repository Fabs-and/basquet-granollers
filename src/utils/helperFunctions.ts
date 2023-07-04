import { strictEqual } from "assert";

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
  return newStr
}

export function divForP(str: string) {
  let newStr;
  if (openDiv.test(str)) {newStr = str.replace(openDiv, '<p>').replace(closingDiv, '</p>');}
  return newStr;
}





