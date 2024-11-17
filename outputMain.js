// <!--  output generator (draws the generated code on the canvas) -->

// --------------------------------------------------
// --------------------------------------------------
//codeGenerator is an object defined in SWP_vxxx.js

// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------

//this will be used for memory size
let canvW = window.innerWidth - 30;
let canvH = window.innerHeight - 50;

//init memory size and instruction lenght
// memory size ---> w * h
// instruction lenght ---> memWidth
let memWidth = parseInt(canvW / 7);
let memHeight = parseInt(canvH / 7);

// this array serves as the memory and the instructions of the program
// at the same time (the program will have memory layers)
let memoryArr = [];

//add the first memory layer
memoryArr.push(codeGenerator.initMemory([], memWidth, memHeight));

//get canvas
let memCanvas = document.getElementById("mainMemoryCanvas");

//set canvas to full window
memCanvas.width = canvW;
memCanvas.height = canvH;

//get canvas context to write
const canvasCtx = memCanvas.getContext("2d");

//update the memory info div with the w and e keys (also updates when memory layers increase)
let memoryInfoDiv = document.getElementById("memoryInfo");


// --------------------------------------------------
// --------------------------------------------------

const colorPallete = {
  r: ["#fc7b03", "#fc0303"],
  g: ["#197342", "#05f719"],
  b: ["#056ef7", "#0521f7"],
};

const cellSize = 7;
let canDraw = false;

// programMainLoop renders the generated code of the program into the canvas
// instructionsTable, currentMemoryLayer, totalMemoryLayers come from the SWP_v3.js file
const programMainLoop = () => {
  // receive code generated
  let newFrame = codeGenerator.getFrame(memoryArr[currentMemoryLayer]);
  memoryArr[currentMemoryLayer] = [...newFrame];
  canDraw = true;

  if (canDraw) {
    canDraw = false;
    for (let y = 0; y < memoryArr[currentMemoryLayer].length; y++) {
      let memRow = memoryArr[currentMemoryLayer][y];
      for (let x = 0; x < memRow.length; x++) {
        //draw code on canvas (change instructions to colors)

        // get color from the insctuctions (read program memory)
        let currCellSym = memoryArr[currentMemoryLayer][y][x];
        let cellColorPointer = instructionsTable[currCellSym][0];

        let cellColorIntensity = parseInt(instructionsTable[currCellSym][1]);
        let currCellColor = colorPallete[cellColorPointer][cellColorIntensity];

        canvasCtx.fillStyle = currCellColor;

        //draw memory cell (x,y,w,h)
        canvasCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
};

// --------------------------------------------------
// --------------------------------------------------

// important!
// (press w and e keys to switch between memory layers, press q to stop the program.)
// stoping the program will output in the console the rules that the program has created for itself

let intervalId;

if (!intervalId) {
  intervalId = setInterval(programMainLoop, 10);
}

//logic for keypress to stop program
document.addEventListener("keydown", (event) => {
  //stop looping and generating data ("stops" the program)
  if (event.key === "q") {
    clearInterval(intervalId);
    // release our intervalId from the variable
    intervalId = null;
    console.log("set of rules: \n ", ruleSet);
  }

  //switch between memory layers
  //(the selected memory layer will be rendered into the canvas)
  //update the memory info div with the w and e keys
  if (event.key === "w") {
    if (currentMemoryLayer > 0) {
      currentMemoryLayer -= 1;
      //update memory info div
      memoryInfoDiv.innerText = `Memory info ---> Current memory layer: ${currentMemoryLayer} || Total memory layers: ${totalMemoryLayers}`;
    }
  }
  if (event.key === "e") {
    if (currentMemoryLayer < totalMemoryLayers - 1) {
      currentMemoryLayer += 1;
      //update memory info div
      memoryInfoDiv.innerText = `Memory info ---> Current memory layer: ${currentMemoryLayer} || Total memory layers: ${totalMemoryLayers}`;
    }
  }
});
