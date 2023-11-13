// ////////////////////////////////////////////////////////////////////////////
// Sudoku difficultly measuring tool
// Measures the difficultly of a sudoku puzzle based on the puzzles total entropy
// defined as the total number of available remaining moves. The more total 
// possibilities, the more difficult the puzzle is to complete (in theory). 
//
// created by Glen Brunke
// November 13, 2023
// brunke.ge@gmail.com
//
// ////////////////////////////////////////////////////////////////////////////
// CONSTANTS
// ////////////////////////////////////////////////////////////////////////////

const CELL_SIZE = 32; //cells are 32 pixels x 32 pixels wide
const BOARD_SIZE = CELL_SIZE * 9;
const VISUAL_HEIGHT = 50; // height of the dashboard
const MENU_X = BOARD_SIZE/4;
const MENU_Y = BOARD_SIZE/4;
const MENU_SIZE = BOARD_SIZE/2;
const PLAYER_NUMBERS = [[]]; // the board as entered by the player
const BOARD_ENTROPY = [[]]; // the board's entropy, or total available moves remaining at each cell
let ACTIVE_CELL = "00"; // the cell selected by the user, used by the menu


// ////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
// ////////////////////////////////////////////////////////////////////////////

// howManyOpenCells() - returns the total number of cells that are open on the board (non zero)
function howManyOpenCells() {
    let openCells = 0;
    for  (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (PLAYER_NUMBERS[i][j] === 0) {
                openCells += 1;
            }
        }
    }
    
    return openCells;
}


// howManyPossibilities() returns the total number of possible, legal moves at a given cell. 
function howManyPossibilities(boardColumn, boardRow) {
    let numberPossible = 0;
    
    if (PLAYER_NUMBERS[(boardColumn-1)][(boardRow-1)] === 0) {
        //if the number is 0, then the cell is open and we can calculate the entropy for the cell
        numberPossible = 0;
        for (let r = 1; r <= 9; r++) {
            if(isValidMove(r,boardColumn, boardRow) === true) {
                numberPossible += 1;
            }
        }
    }
    else {
        //if the number is not 0, we assume that it is correct and there are no remaining possibilites
        numberPossible = 0;
    }
    
    return numberPossible;
}

// updateEntropy() - updated the gloabl BOARD_ENTROPY grid with the current values
function updateEntropy() {
    for (let p = 0; p < 9; p++) {
        for (let b = 0; b < 9; b++) {
            BOARD_ENTROPY[p][b] = howManyPossibilities(p+1,b+1);
        }
    }    
}

// drawBoard() - draws the 9x9 grid on the canvas
function drawBoard(ctx) {
    ctx.fillStyle = "rgba(240,240,240, 1";
    ctx.fillRect(0, 0, 288, 288);  


    ctx.strokeStyle = "rgba(0, 0, 0, 0.5";
    ctx.lineWidth = 1; 
    for (let i = 0; i < BOARD_SIZE; i += CELL_SIZE) {
        for (let j = 0; j < BOARD_SIZE; j += CELL_SIZE) {
            ctx.strokeRect(i, j, CELL_SIZE, CELL_SIZE);            
        }
    }
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8";
    ctx.lineWidth = 3;     
    for (let k = 0; k < BOARD_SIZE; k += (CELL_SIZE * 3)) {
        for (let h = 0; h < BOARD_SIZE; h += (CELL_SIZE * 3)) {
            ctx.strokeRect(k, h, (CELL_SIZE * 3), (CELL_SIZE * 3));             
        }
    }
}

// drawEntropyVisual() - draws dashboard below the playing board
function drawEntropyVisual(ctx) {
    let difficultyScore = measureEntropy();
    let openCells = howManyOpenCells();
    
    let userMessage = "";
    let visualBarStyle = "rgba(0,255,0, 1";
    let visualBarLength = 25;
    
    if (difficultyScore > 200 && openCells > 66) { userMessage = "need some additional numbers"; visualBarStyle = "rgba(150,150,150, 1"; visualBarLength = 198; }
    else {
        if (difficultyScore > 200) { userMessage = "omg, insane!!!"; visualBarStyle = "rgba(255,50,0, 1"; visualBarLength = 198;}
        else if (difficultyScore <= 200 && difficultyScore > 175) { userMessage = "yikes!!!! very challenging."; visualBarStyle = "rgba(255,100,0, 1"; visualBarLength = difficultyScore;}
        else if (difficultyScore <= 275 && difficultyScore > 150) { userMessage = "that's a doozy"; visualBarStyle = "rgba(200,165,0, 1"; visualBarLength = difficultyScore;}
        else if (difficultyScore <= 150 && difficultyScore > 125) { userMessage = "ok, that's a little spicy"; visualBarStyle = "rgba(200,200,0, 1";visualBarLength = difficultyScore;}
        else if (difficultyScore <= 150 && difficultyScore > 125) { userMessage = "no too bad..."; visualBarStyle = "rgba(100,190,0, 1";visualBarLength = difficultyScore;}
        else if (difficultyScore <= 125 && difficultyScore > 100) { userMessage = "you got this"; visualBarStyle = "rgba(50,220,0, 1";visualBarLength = difficultyScore;}
        else if (difficultyScore <= 100 && difficultyScore > 75) { userMessage = "easy peasey"; visualBarStyle = "rgba(0,220,0, 1"; visualBarLength = difficultyScore;}
        else if (difficultyScore <= 75 && difficultyScore > 50){ userMessage = "nice, just need to finish it up"; visualBarStyle = "rgba(0,255,0, 1"; visualBarLength = difficultyScore; }
        else if (difficultyScore <= 50 && difficultyScore > 0){ userMessage = "almost there..."; visualBarStyle = "rgba(0,255,0, 1"; visualBarLength = difficultyScore; }
        else if (openCells === 0) {userMessage = "Yay!!!! Completed puzzle!!!"; visualBarStyle = "rgba(0,255,0, 1"; visualBarLength = difficultyScore;}
        else {userMessage = "something went wrong"; visualBarStyle = "rgba(0,255,0, 1"; visualBarLength = difficultyScore;}
    }
    
    ctx.clearRect(0, BOARD_SIZE, BOARD_SIZE, VISUAL_HEIGHT);
    
    ctx.fillStyle = "rgba(255,255,255, 1";
    ctx.fillRect(0,288, BOARD_SIZE, VISUAL_HEIGHT);  
    

    
    ctx.font = '24px Arial';
    ctx.fillStyle = "rgba(50,50,50, 1";
    ctx.fillText(difficultyScore, 238, 330);


    
    ctx.font = '13px Arial';
    ctx.fillStyle = "rgba(50,50,50, 1";
    ctx.fillText("Remaining Difficulty", 90, 302);
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8";
    ctx.lineWidth = 1;     
    ctx.strokeRect(25, 310, 200, 25); 
    ctx.fillStyle = visualBarStyle;
    ctx.fillRect(26,311, visualBarLength, 23);  
    
    ctx.font = '14px Arial';
    ctx.fillStyle = "rgba(50,50,50, 1";
    ctx.fillText(userMessage, 30, 327);
}

//drawNumberOnBoard() - draws the specified number (numberToDraw) on the board at the 
// specified cell (boardColumn x boardRow)
function drawNumberOnBoard(ctx, numberToDraw, boardColumn, boardRow) {
    
    let boardPixelX = (boardRow - 1) * CELL_SIZE + 10;
    let boardPixelY = (boardColumn - 1) * CELL_SIZE + 25;
    
    ctx.font = '24px Arial';
    ctx.fillStyle = "rgba(50,50,50, 1";
    ctx.fillText(numberToDraw, boardPixelX, boardPixelY);
}



// shadeCell() - draws a semi transparent box over the specified cell, can draw red, grey or a variety of green colors 
function shadeCell(ctx, boardRow, boardColumn, shadeColor) {
    let boardPixelX = (boardColumn - 1) * CELL_SIZE;
    let boardPixelY = (boardRow - 1) * CELL_SIZE;

    if (shadeColor == "red") {
        ctx.fillStyle = "rgba(240,100,100, .5";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);
    }
    else if (shadeColor === "green9") {
        ctx.fillStyle = "rgba(0,25,0, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);        
    }
    else if (shadeColor === "green8") {
        ctx.fillStyle = "rgba(0,50,0, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);        
    }
    else if (shadeColor === "green7") {
        ctx.fillStyle = "rgba(0,75,0, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);        
    }
    else if (shadeColor === "green6") {
        ctx.fillStyle = "rgba(0,100,0, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);        
    }
    else if (shadeColor === "green5") {
        ctx.fillStyle = "rgba(0,125,0, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);         
    }
    else if (shadeColor === "green4") {
        ctx.fillStyle = "rgba(0,150,0, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);         
    }
    else if (shadeColor === "green3") {
        ctx.fillStyle = "rgba(0,175,0, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);         
    }
    else if (shadeColor === "green2") {
        ctx.fillStyle = "rgba(0,200,0, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);         
    }
    else if (shadeColor === "green1") {
        ctx.fillStyle = "rgba(0,100,100, .7";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);         
    }
    else {
        ctx.fillStyle = "rgba(100,100,100, .5";
        ctx.fillRect(boardPixelX, boardPixelY, CELL_SIZE, CELL_SIZE);        
    }
    
}

function drawMenu(ctx) {
    let menuNumber = 1;
    ctx.fillStyle = "rgba(100,100,100, .5";
    ctx.fillRect(0,0, BOARD_SIZE, BOARD_SIZE);  
    ctx.fillRect(MENU_X, MENU_Y, MENU_SIZE, MENU_SIZE+20);
    
    for(let menuRow = 0; menuRow < 3; menuRow++) {
        for (let menuCol = 0; menuCol < 3; menuCol++) {
            ctx.fillStyle = "rgba(100,100,100, .7";
            ctx.fillRect(MENU_X+(CELL_SIZE/2)+((menuCol)*(CELL_SIZE+10)),MENU_Y+(CELL_SIZE/2)+(menuRow*(CELL_SIZE+10)), CELL_SIZE, CELL_SIZE);  
            
            ctx.font = '24px Arial';
            ctx.fillStyle = "rgba(255,255,255, 1";
            ctx.fillText(menuNumber, MENU_X+10+(CELL_SIZE/2)+((menuCol)*(CELL_SIZE+10)),MENU_Y+25+(CELL_SIZE/2)+(menuRow*(CELL_SIZE+10)));
            menuNumber += 1;
        }

    }
    
    ctx.font = '12px Arial';    
    ctx.fillStyle = "rgba(255,255,255, 1";
    ctx.fillText("CLEAR", MENU_X+16, MENU_Y+(BOARD_SIZE/1.9)); 
    
    ctx.fillStyle = "rgba(255,255,255, 1";
    ctx.fillText("CANCEL", MENU_X+80, MENU_Y+(BOARD_SIZE/1.9)); 
    
}

// translateToGrid() - determines the board column or row at a given pixel coordinate 
function translateToGrid(pixelCoordinate) {
    let gridNumber = 0;
    
    for (let i = 0; i < pixelCoordinate; i += CELL_SIZE) {
        gridNumber++;
    } 
    
    return gridNumber;
}

// getMenuSelection - returns the number selected by the user based on where they 
// clicked the mouse. The menu is mapped with x & y pixel coordinates.
function getMenuSelection (boardX, boardY) {
    let menuSelection = PLAYER_NUMBERS[ACTIVE_CELL[1]-1][ACTIVE_CELL[0]-1];
    
    let calcX1 = MENU_X+(CELL_SIZE/2)+((0)*(CELL_SIZE+10));
    let calcX2 = MENU_X+(CELL_SIZE/2)+((1)*(CELL_SIZE+10));
    let calcX3 = MENU_X+(CELL_SIZE/2)+((2)*(CELL_SIZE+10));
    
    let calcY1 = MENU_Y+(CELL_SIZE/2)+(0*(CELL_SIZE+10));
    let calcY2 = MENU_Y+(CELL_SIZE/2)+(1*(CELL_SIZE+10));
    let calcY3 = MENU_Y+(CELL_SIZE/2)+(2*(CELL_SIZE+10));
    
    let clearX = MENU_X+14;
    let clearY = MENU_Y+(BOARD_SIZE/2)-6;

     
    if (boardX >= calcX1 && boardX <= calcX1+CELL_SIZE && boardY >= calcY1 && boardY <= calcY1+CELL_SIZE) {
        menuSelection = 1;
    }
    else if (boardX >= calcX2 && boardX <= calcX2+CELL_SIZE && boardY >= calcY1 && boardY <= calcY1+CELL_SIZE) {
        menuSelection = 2;
    }
    else if (boardX >= calcX3 && boardX <= calcX3+CELL_SIZE && boardY >= calcY1 && boardY <= calcY1+CELL_SIZE) {
        menuSelection = 3;
    }
    else if (boardX >= calcX1 && boardX <= calcX1+CELL_SIZE && boardY >= calcY2 && boardY <= calcY2+CELL_SIZE) {
        menuSelection = 4;
    }
    else if (boardX >= calcX2 && boardX <= calcX2+CELL_SIZE && boardY >= calcY2 && boardY <= calcY2+CELL_SIZE) {
        menuSelection = 5;
    }
    else if (boardX >= calcX3 && boardX <= calcX3+CELL_SIZE && boardY >= calcY2 && boardY <= calcY2+CELL_SIZE) {
        menuSelection = 6;
    }
    else if (boardX >= calcX1 && boardX <= calcX1+CELL_SIZE && boardY >= calcY3 && boardY <= calcY3+CELL_SIZE) {
        menuSelection = 7;
    }
    else if (boardX >= calcX2 && boardX <= calcX2+CELL_SIZE && boardY >= calcY3 && boardY <= calcY3+CELL_SIZE) {
        menuSelection = 8;
    }
    else if (boardX >= calcX3 && boardX <= calcX3+CELL_SIZE && boardY >= calcY3 && boardY <= calcY3+CELL_SIZE) {
        menuSelection = 9;
    }
    else if (boardX >= clearX && boardX <= clearX+44 && boardY >= clearY && boardY <= clearY+20) {
        menuSelection = 0;
    }
    
    return menuSelection;   
}

// initializePlayerNumbers() - clears the board's numbers, setting all values
// to 0. Used to initialize the program.
function initializePlayerNumbers() {
    
    for (let p = 0; p < 9; p++) {
        PLAYER_NUMBERS[p] = [];
        for (let b = 0; b < 9; b++) {
            PLAYER_NUMBERS[p][b] = 0;
        }
    }
}

// initializeBoardEntropy() - clears the board's entropy, setting all values
// to 0. Used to initialize the program.
function initializeBoardEntropy() {
    
    for (let p = 0; p < 9; p++) {
        BOARD_ENTROPY[p] = [];
        for (let b = 0; b < 9; b++) {
            BOARD_ENTROPY[p][b] = 0;
        }
    }
}

// drawPlayerNumbers() - draw the current numbers for the board to the canvas
function drawPlayerNumbers(ctx) {
    
    for (let w = 0; w < 9; w++) {
        for (let n = 0; n < 9; n++) {
            if (PLAYER_NUMBERS[w][n] > 0) {
                drawNumberOnBoard(ctx, PLAYER_NUMBERS[w][n], w+1, n+1);
            }
        }
    }
}

// highlightErrors() - Hightlights any cells with a red box with conflicting plays (duplicate numbers
// in the row, column, or box). if at least one error is found, this function returns true, otherwise it returns false.
function highlightErrors(ctx) {
    let arrayIndex = 0;
    let shadedCells = [[]];
    let errorsFoundFlag = 0;
    
    // Create an empty map to keep track of cells that have already been shaded
    for (y=0; y < 9; y++) {
        shadedCells[y] = [];
        for(q=0; q<9; q++) {
            shadedCells[y][q] = 0;
        }
    }
    
    //loop through and shade any horizontal duplicates
    for (arrayIndex = 0; arrayIndex< 9; arrayIndex++) {
        let { duplicates, indexes } = findDuplicateIndexes(PLAYER_NUMBERS[arrayIndex]);
        for (let i = 0; i < duplicates.length; i++) {
            if (duplicates[i] > 0) {
                for (let w = 0; w < indexes[duplicates[i]].length; w++) {
                    if(shadedCells[arrayIndex][indexes[duplicates[i]][w]] == 0) {
                        shadeCell(ctx, arrayIndex+1, indexes[duplicates[i]][w]+1, "red");
                        shadedCells[arrayIndex][indexes[duplicates[i]][w]] = 1;
                        errorsFoundFlag = 1;
                    }
                }
            }
        }
    }
    
    //loop through and shade any verticle duplicates
    for (arrayIndex = 0; arrayIndex < 9; arrayIndex++) {
        let verticleArray = [];
        for (let i = 0; i < 9; i++) {
            verticleArray[i] = PLAYER_NUMBERS[i][arrayIndex];         
        }
        
        let { duplicates, indexes } = findDuplicateIndexes(verticleArray); 
        
        for (let j = 0; j < duplicates.length; j++) {
            if (duplicates[j] > 0) {
                for (let w = 0; w < indexes[duplicates[j]].length; w++) {
                    if(shadedCells[indexes[duplicates[j]][w]][arrayIndex] == 0) {
                        shadeCell(ctx, indexes[duplicates[j]][w]+1,  arrayIndex+1, "red");
                        shadedCells[indexes[duplicates[j]][w]][arrayIndex] = 1;
                        errorsFoundFlag = 1;
                    }
                }
            }
        }
        
    }
    
    // loop through each box and shade any remaining duplicates
    // this code is a little embarassing, I couldn't figure out how to loop through the box to translate the row and column, so created the monster if statement below. sorry! :)
    for (let boxIndex = 0; boxIndex < 9; boxIndex+=3) {
        let boxArray = [];
        for (let boxCell = 0; boxCell < 9; boxCell+=3) {
            
            boxArray[0] = PLAYER_NUMBERS[boxIndex][boxCell];
            boxArray[1] = PLAYER_NUMBERS[boxIndex][boxCell+1];
            boxArray[2] = PLAYER_NUMBERS[boxIndex][boxCell+2];
            
            boxArray[3] = PLAYER_NUMBERS[boxIndex+1][boxCell];
            boxArray[4] = PLAYER_NUMBERS[boxIndex+1][boxCell+1];
            boxArray[5] = PLAYER_NUMBERS[boxIndex+1][boxCell+2];

            boxArray[6] = PLAYER_NUMBERS[boxIndex+2][boxCell];
            boxArray[7] = PLAYER_NUMBERS[boxIndex+2][boxCell+1];
            boxArray[8] = PLAYER_NUMBERS[boxIndex+2][boxCell+2];

            let { duplicates, indexes } = findDuplicateIndexes(boxArray);

            for (let j = 0; j < duplicates.length; j++) {
                if (duplicates[j] > 0) {
                    for (let w = 0; w < indexes[duplicates[j]].length; w++) {
                        let translatedRow = 0;
                        let translatedColumn = 0;
                        
                        if (indexes[duplicates[j]][w] == 0) { translatedRow = boxIndex; translatedColumn = boxCell; }
                        else if (indexes[duplicates[j]][w] == 1) { translatedRow = boxIndex; translatedColumn = boxCell+1; }
                        else if (indexes[duplicates[j]][w] == 2) { translatedRow = boxIndex; translatedColumn = boxCell+2; }

                        else if (indexes[duplicates[j]][w] == 3) { translatedRow = boxIndex+1; translatedColumn = boxCell; }
                        else if (indexes[duplicates[j]][w] == 4) { translatedRow = boxIndex+1; translatedColumn = boxCell+1; }
                        else if (indexes[duplicates[j]][w] == 5) { translatedRow = boxIndex+1; translatedColumn = boxCell+2; }

                        else if (indexes[duplicates[j]][w] == 6) { translatedRow = boxIndex+2; translatedColumn = boxCell; }
                        else if (indexes[duplicates[j]][w] == 7) { translatedRow = boxIndex+2; translatedColumn = boxCell+1; }
                        else if (indexes[duplicates[j]][w] == 8) { translatedRow = boxIndex+2; translatedColumn = boxCell+2; }
                        
                        if(shadedCells[translatedRow][translatedColumn] == 0) {
                            shadeCell(ctx, translatedRow+1,  translatedColumn+1, "red");
                            shadedCells[translatedRow][translatedColumn] = 1;
                            errorsFoundFlag = 1;
                        }
                    }
                }
            }            
        }
    }
    
    if (errorsFoundFlag == 1) {
        return true;
    }
    else {
        return false;
    }
}

// isValidMove() - determines if the provided move is valid or not by checking for duplicate
// numbers in the same row, column, or 3x3 box. Returns true if valid, or false if not valid.
function isValidMove(numberToTest, boardColumn, boardRow) {
    let validFlag = true;
    let arrayIndex = 0;
    
    //check for horizontal duplicates
    if (PLAYER_NUMBERS[(boardColumn-1)].includes(numberToTest) == true) { validFlag = false; }

    
    //loop through and check for verticle duplicates
    for (arrayIndex = 0; arrayIndex < 9; arrayIndex++) {
        if (arrayIndex == (boardRow-1)) {
            
            let verticleArray = [];
            for (let i = 0; i < 9; i++) {
                verticleArray[i] = PLAYER_NUMBERS[i][arrayIndex];         
            }

            if (verticleArray.includes(numberToTest) == true) { validFlag = false;} 
        }
    }

    // loop through each box and check for remaining duplicates
    for (let boxIndex = 0; boxIndex < 9; boxIndex+=3) {
        let boxArray = [];
        for (let boxCell = 0; boxCell < 9; boxCell+=3) {
            
            boxArray[0] = PLAYER_NUMBERS[boxIndex][boxCell];
            boxArray[1] = PLAYER_NUMBERS[boxIndex][boxCell+1];
            boxArray[2] = PLAYER_NUMBERS[boxIndex][boxCell+2];
            
            boxArray[3] = PLAYER_NUMBERS[boxIndex+1][boxCell];
            boxArray[4] = PLAYER_NUMBERS[boxIndex+1][boxCell+1];
            boxArray[5] = PLAYER_NUMBERS[boxIndex+1][boxCell+2];

            boxArray[6] = PLAYER_NUMBERS[boxIndex+2][boxCell];
            boxArray[7] = PLAYER_NUMBERS[boxIndex+2][boxCell+1];
            boxArray[8] = PLAYER_NUMBERS[boxIndex+2][boxCell+2];
            
            if (boxIndex == (boardColumn -1) || (boxIndex+1) == (boardColumn -1) || (boxIndex+2) == (boardColumn -1)) {
                if (boxCell == (boardRow -1) || (boxCell+1) == (boardRow -1) || (boxCell+2) == (boardRow -1)) {
                    if (boxArray.includes(numberToTest) == true) { validFlag = false; }                   
                }
            }

        }
    }
    
    return validFlag;
}

// findDuplicateIndexes() - finds any duplicates in the supplied array, returns the duplicate numbers and the index map
function findDuplicateIndexes(arr) {
  const indexMap = {}; // To store the indexes of values
  const duplicates = []; // To store the duplicate values

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];

    if (indexMap[value] !== undefined) {
      // If the value is already in the index map, it's a duplicate
      if (duplicates.includes(value) === false) {
        duplicates.push(value);
      }

      // Add the current index to the index map as well
      indexMap[value].push(i);
    } else {
      // If it's the first occurrence, create an array to store the index
      indexMap[value] = [i];
    }
  }

  // Return an object containing the duplicates and their indexes
  return { duplicates, indexes: indexMap };
}

// drawEntropy - shades each cell depending on how many remaining moves are available (the remaining entropy)
function drawEntropy(ctx) {
    for (let p = 0; p < 9; p++) {
        for (let b = 0; b < 9; b++) {
            if (BOARD_ENTROPY[p][b] == 0) { } // do nothing
            else if (BOARD_ENTROPY[p][b] == 1) {shadeCell(ctx, p+1, b+1, "green1"); }
            else if (BOARD_ENTROPY[p][b] == 2) {shadeCell(ctx, p+1, b+1, "green2"); }
            else if (BOARD_ENTROPY[p][b] == 3) {shadeCell(ctx, p+1, b+1, "green3"); }
            else if (BOARD_ENTROPY[p][b] == 4) {shadeCell(ctx, p+1, b+1, "green4"); }
            else if (BOARD_ENTROPY[p][b] == 5) {shadeCell(ctx, p+1, b+1, "green5"); }
            else if (BOARD_ENTROPY[p][b] == 6) {shadeCell(ctx, p+1, b+1, "green6"); }
            else if (BOARD_ENTROPY[p][b] == 7) {shadeCell(ctx, p+1, b+1, "green7"); }
            else if (BOARD_ENTROPY[p][b] == 8) {shadeCell(ctx, p+1, b+1, "green8"); }
            else if (BOARD_ENTROPY[p][b] == 9) {shadeCell(ctx, p+1, b+1, "green9"); }
        }
    }    
}

// measureEntropy() - all up all of the total remaining moves to measure the total board's entropy
function measureEntropy() {
    let totalEntropy = 0;
    for (let p = 0; p < 9; p++) {
        for (let b = 0; b < 9; b++) {
            totalEntropy += BOARD_ENTROPY[p][b];
        }
    }  
    return totalEntropy;
}

// ////////////////////////////////////////////////////////////////////////////
// MAIN PROGRAM LOGIC
// ////////////////////////////////////////////////////////////////////////////


// the user is presented with a blank board at the application's open
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let isMenuActive = false;

initializePlayerNumbers();
initializeBoardEntropy();
drawBoard(ctx);



// all actions on the board are determined with the click of the mouse (or finger for mobile)
canvas.addEventListener('click', (event) => {
    
    let myY = event.clientY - canvas.getBoundingClientRect().top;
    let myX = event.clientX - canvas.getBoundingClientRect().left;
    let boardX = myX;
    let boardY = myY;
    
    myX = translateToGrid(myX);
    myY = translateToGrid(myY);
    
    // if the menu is not up, then bring it up
    if (isMenuActive == false) {
        isMenuActive = true;
        shadeCell(ctx, myY, myX, "grey");
        ACTIVE_CELL = "" + myX + "" + myY;
        drawMenu(ctx);
    }
    
    // if the menu is already up, then the next click should make it go away and process 
    // the input from teh user.
    else {
        ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
        drawBoard(ctx);
        let numberToDraw = getMenuSelection(boardX, boardY);
        PLAYER_NUMBERS[(ACTIVE_CELL[1]-1)][(ACTIVE_CELL[0]-1)] = numberToDraw;
        drawPlayerNumbers(ctx);
        highlightErrors(ctx);
        
        updateEntropy();
        drawEntropy(ctx);
        isMenuActive = false;
    }
    
    drawEntropyVisual(ctx);

});

