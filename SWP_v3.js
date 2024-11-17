const instructionSet = {
  r: ["*", "+"],
  g: ["#", "@"],
  b: ["<", ">"],
};

//this table is a helper for executing the instructions
const instructionsTable = {
  "*": ["r", "0"],
  "+": ["r", "1"],
  "#": ["g", "0"],
  "@": ["g", "1"],
  "<": ["b", "0"],
  ">": ["b", "1"],
};

//counters for the memory layers
let currentMemoryLayer = 0;
let totalMemoryLayers = 1;


//the rules will be generated on a "experience" basis
//meaning that the rules will be created and decided in the moment they are being processed
//this will create a dynamic way for the program to write it's own rules(needs improvement obviously)
//doing this will make every program unique, since they are creating the rules based on what is being "experienced"
//this doenst make too much sense for this implementation , but it will become important later
// every program has it's own unique "brain"
// composed of several layers and rules
const colorsArr = Object.keys(instructionSet);
let ruleSet = {};

//NOTE :if you want to see again or test something with the rule set previously generated,
//you can copy the console output after the program is finished,
//and then you can come here and replace the ruleSet definition
//with an already existing rule set  (dont forget to comment the old one!) :
//example:
//this one creates a really cool pattern, takes some time for it to evolve, but after a minute or two
//you can clearly see it
// let ruleSet = {
//   "r": {
//       "g": "b",
//       "b": "g",
//       "r": "g"
//   },
//   "b": {
//       "r": "b",
//       "b": "r",
//       "g": "r"
//   },
//   "g": {
//       "r": "b",
//       "g": "r",
//       "b": "g"
//   }
// }
//you will probably have to parse the program output to a javasctipt object but that is easy to do

const applyRules = (baseColor, tempColor) => {
  //does this rule already exists?
  if (ruleSet.hasOwnProperty(baseColor)) {
    if (ruleSet[baseColor].hasOwnProperty(tempColor)) {
      //apply the current rule
      return ruleSet[baseColor][tempColor];
    } else {
      //add new rule for this baseColor and different tempColor
      let randColor = colorsArr[Math.floor(Math.random() * colorsArr.length)];
      //don't override the tempColor object inside baseColor
      if (Object.keys(ruleSet[baseColor]).length <= 0) {
        ruleSet[baseColor] = { tempColor };
        ruleSet[baseColor][tempColor] = randColor;
        delete ruleSet[baseColor].tempColor;
        return ruleSet[baseColor][tempColor];
      } else {
        ruleSet[baseColor][tempColor] = randColor;
        delete ruleSet[baseColor].tempColor;
        return ruleSet[baseColor][tempColor];
      }
    }
  } else {
    //this is a new rule, add it to the list
    let randColor = colorsArr[Math.floor(Math.random() * colorsArr.length)];
    ruleSet[baseColor] = { tempColor };
    ruleSet[baseColor][tempColor] = randColor;
    //(this is because of the [] notation to access properties)
    delete ruleSet[baseColor].tempColor;
    return ruleSet[baseColor][tempColor];
  }
};

// --------------------------------------------------
// --------------------------------------------------

//helper function to replace a instruction from the memory
const setCharAt = (str, index, chr) => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

const executeInstruction = (currColSym, tempCellSym) => {
  //sum the values first
  let currColNum = parseInt(instructionsTable[currColSym][1]);
  let tempCellNum = parseInt(instructionsTable[tempCellSym][1]);
  let sumResult = currColNum + tempCellNum;

  //only binary for now, so reset to zero if is equal to 2
  if (sumResult === 2) {
    sumResult = 0;
  }

  //identify the cells values to apply rule
  let currColColor = instructionsTable[currColSym][0];
  let tempCellColor = instructionsTable[tempCellSym][0];
  let ruleResult = applyRules(currColColor, tempCellColor);

  // console.log("QQQ testing : ", ruleResult);

  let newInstruct = instructionSet[ruleResult][sumResult];
  return newInstruct;
};

const getNeighborSymbol = (memoryArr, pos, row, col) => {
  let tempCellSym = "";

  switch (pos) {
    //-----------------------------------------------------
    //-----------------------------------------------------
    // top row
    //top left
    case "t1":
      try {
        // get temp cell value (instruction symbol)
        tempCellSym = memoryArr[row - 1][col - 1];
        return tempCellSym;
      } catch (error) {
        return null;
      }

      break;

    //top middle
    case "t2":
      try {
        // get temp cell value (instruction symbol)
        tempCellSym = memoryArr[row - 1][col];
        return tempCellSym;
      } catch (error) {
        return null;
      }

      break;

    //top right
    case "t3":
      try {
        // get temp cell value (instruction symbol)
        tempCellSym = memoryArr[row - 1][col + 1];
        return tempCellSym;
      } catch (error) {
        return null;
      }

      break;

    //-----------------------------------------------------
    //-----------------------------------------------------
    // middle row
    //middle left
    case "m1":
      try {
        // get temp cell value (instruction symbol)
        tempCellSym = memoryArr[row][col - 1];
        return tempCellSym;
      } catch (error) {
        return null;
      }

      break;

    //middle middle is the current [row][col] symbol so i skip this case

    //middle right
    case "m3":
      try {
        // get temp cell value (instruction symbol)
        tempCellSym = memoryArr[row][col + 1];
        return tempCellSym;
      } catch (error) {
        return null;
      }

      break;

    //-----------------------------------------------------
    //-----------------------------------------------------
    // bottom row
    //bottom left
    case "b1":
      try {
        // get temp cell value (instruction symbol)
        tempCellSym = memoryArr[row + 1][col - 1];
        return tempCellSym;
      } catch (error) {
        return null;
      }

      break;

    //bottom middle
    case "b2":
      try {
        // get temp cell value (instruction symbol)
        tempCellSym = memoryArr[row + 1][col];
        return tempCellSym;
      } catch (error) {
        return null;
      }

      break;

    //bottom right
    case "b3":
      try {
        // get temp cell value (instruction symbol)
        tempCellSym = memoryArr[row + 1][col + 1];
        return tempCellSym;
      } catch (error) {
        return null;
      }

      break;

    default:
      break;
  }
};

const executeStep = (memoryArr, currColSym, neighborPos, row, col) => {
  //get neighbor Symbol
  let neighborSymbol = getNeighborSymbol(memoryArr, neighborPos, row, col);
  let colNum = 0;
  let rowNum = 0;

  if (neighborSymbol !== null && neighborSymbol !== undefined) {
    //execute instruction on neighbor cell (sum and apply rule)
    let newInstruction = executeInstruction(currColSym, neighborSymbol);

    //check index pos before replacing
    switch (neighborPos) {
      //top
      case "t1":
        rowNum = parseInt(row - 1);
        colNum = parseInt(col - 1);
        break;
      case "t2":
        rowNum = parseInt(row - 1);
        colNum = parseInt(col);
        break;
      case "t3":
        rowNum = parseInt(row - 1);
        colNum = parseInt(col + 1);
        break;

      //middle
      case "m1":
        rowNum = parseInt(row);
        colNum = parseInt(col - 1);
        break;

      case "m3":
        rowNum = parseInt(row);
        colNum = parseInt(col + 1);
        break;

      //bottom
      case "b1":
        rowNum = parseInt(row + 1);
        colNum = parseInt(col - 1);
        break;
      case "b2":
        rowNum = parseInt(row + 1);
        colNum = parseInt(col);
        break;
      case "b3":
        rowNum = parseInt(row + 1);
        colNum = parseInt(col + 1);
        break;

      default:
        break;
    }

    //replace neighbor cell symbol
    let tempRow = setCharAt(memoryArr[rowNum], colNum, newInstruction);
    if (memoryArr[rowNum] !== tempRow) {
      memoryArr[rowNum] = tempRow;
      return memoryArr;
    }
  }
};

// --------------------------------------------------
// --------------------------------------------------

const codeGenerator = {
  //main function, reads the memory and executes the instructions
  getFrame: (memoryArr) => {
    let newFrame = null;
    // loop the memory and execute the program
    //curr symbol is assumed to be the center of a 3x3 grid
    // * * *
    // * C *
    // * * *

    for (let y = 0; y < memoryArr.length; y++) {
      let memRow = memoryArr[y];
      for (let x = 0; x < memRow.length; x++) {
        executeStep(memoryArr, memoryArr[y][x], "t1", y, x);
        executeStep(memoryArr, memoryArr[y][x], "t2", y, x);
        executeStep(memoryArr, memoryArr[y][x], "t3", y, x);
        executeStep(memoryArr, memoryArr[y][x], "m1", y, x);
        executeStep(memoryArr, memoryArr[y][x], "m3", y, x);
        executeStep(memoryArr, memoryArr[y][x], "b1", y, x);
        executeStep(memoryArr, memoryArr[y][x], "b2", y, x);
        executeStep(memoryArr, memoryArr[y][x], "b3", y, x);
      }
    }
    newFrame = [...memoryArr];
    return newFrame;
  },
  initMemory: (memoryArr, memWidth, memHeight) => {
    //fill array with random instructions from instructionSet
    for (let y = 0; y < memHeight; y++) {
      let instructionString = "";
      for (let x = 0; x < memWidth; x++) {
        // arr[(Math.floor(Math.random() * arr.length))]
        let colors = Object.keys(instructionSet);
        let randColor = colors[Math.floor(Math.random() * colors.length)];
        let newInstruction =
          instructionSet[randColor][
            Math.floor(Math.random() * instructionSet[randColor].length)
          ];
        instructionString += newInstruction;
      }
      memoryArr.push(instructionString);
    }

    return memoryArr;
  },
};
