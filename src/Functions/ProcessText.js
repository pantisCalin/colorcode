const Initiate = (word, string, color, bold) => {
  const splittedString = string.split(word);
  if (splittedString.length > 1) {
    let coloredArray = [];
    for (let i = 0; i < splittedString.length; i++) {
      coloredArray.push({
        text: splittedString[i],
        colored: false,
      });
      coloredArray.push({
        text: word,
        colored: true,
        color: color,
        bold: bold,
      });
    }
    coloredArray.pop();
    return coloredArray;
  } else {
    return [{ text: string, colored: false }];
  }
};
const CheckIn = (array, string) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].words[0] === string) {
      return true;
    }
  }
  return false;
};
const ScanVariablesFunc = (
  string,
  colorMain,
  colorSecondary,
  colorFunc,
  boldMain,
  boldSecondary,
  boldFunc
) => {
  const splittedString = string.split(/(\(|\)|\n|=|,)/);
  let brackets = 0;
  let allDetected = [];
  for (let i = 0; i < splittedString.length; i++) {
    if (splittedString[i] === "(") {
      const funcSUS = splittedString[i - 1]
        .split(/(\ |\.)/)
        .at(-1)
        .trim();

      funcSUS.length > 0 &&
        !CheckIn(allDetected, funcSUS) &&
        allDetected.push({
          words: [funcSUS],
          color: colorFunc,
          bold: boldFunc,
        });
      brackets += 1;
    } else if (splittedString[i] === ")") {
      brackets -= 1;
    }
    if (splittedString[i] === "=") {
      if (brackets > 0) {
        !CheckIn(allDetected, splittedString[i - 1].trim()) &&
          allDetected.push({
            words: [splittedString[i - 1].trim()],
            color: colorSecondary,
            bold: boldSecondary,
          });
      } else {
        !CheckIn(allDetected, splittedString[i - 1].trim()) &&
          allDetected.push({
            words: [splittedString[i - 1].trim()],
            color: colorMain,
            bold: boldMain,
          });
      }
    }
  }
  return allDetected.sort((a, b) => b.words[0].length - a.words[0].length);
};
const ScanBetween = (string, str1, str2, color, bold) => {
  var regex = new RegExp("(" + str1 + "|" + str2 + ")+");
  const splittedString = string.split(regex);
  let startColor = false;
  let keywords = [];
  let isFirstPushed = false;
  for (let i = 0; i < splittedString.length; i++) {
    if (splittedString[i] === str2 && startColor) {
      startColor = false;
    } else if (splittedString[i] === str1) {
      startColor = true;
    }
    if (startColor) {
      isFirstPushed && keywords.push(str1 + splittedString[i]);
      isFirstPushed = !isFirstPushed;
    }
  }
  return { words: keywords, color: color, bold: bold };
};
const ProcessText = (bulkText, keyWords, digits, variableColors) => {
  const comments = ScanBetween(
    bulkText,
    `#`,
    `\n`,
    variableColors.comments.color,
    variableColors.comments.bold
  );
  const strings1 = ScanBetween(
    bulkText,
    `'`,
    `'`,
    variableColors.strings1.color,
    variableColors.strings1.bold
  );
  const strings2 = ScanBetween(
    bulkText,
    `"`,
    `"`,
    variableColors.strings2.color,
    variableColors.strings2.bold
  );
  const variables = ScanVariablesFunc(
    bulkText,
    variableColors.variables1.color,
    variableColors.variables2.color,
    variableColors.function.color,
    variableColors.variables1.bold,
    variableColors.variables2.bold,
    variableColors.function.bold
  );
  keyWords = [comments, strings1, strings2, ...variables, ...keyWords, digits];

  let coloredArray = [{ text: bulkText, colored: false }];
  for (let i = 0; i < keyWords.length; i++) {
    const keyWordSet = keyWords[i].words;
    const specificColor = keyWords[i].color;
    const specificBold = keyWords[i].bold;
    for (let j = 0; j < keyWordSet.length; j++) {
      const keyWord = keyWordSet[j];
      for (let k = 0; k < coloredArray.length; k++) {
        if (!coloredArray[k].colored) {
          const coloredWords = Initiate(
            keyWord,
            coloredArray[k].text,
            specificColor,
            specificBold
          );

          coloredArray = [
            ...coloredArray.slice(0, k),
            ...coloredWords,
            ...coloredArray.slice(k + 1),
          ];
        }
      }
    }
  }
  return coloredArray;
};

export default ProcessText;
