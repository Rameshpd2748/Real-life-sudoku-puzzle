var arr = [[], [], [], [], [], [], [], [], []]
var temp = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

function initializeTemp(temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            temp[i][j] = false;
        }
    }
}


function setTemp(board, temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                temp[i][j] = true;
            }
        }
    }
}


function setColor(temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (temp[i][j] == true) {
                arr[i][j].style.color ="#DC3545";
            }

        }
    }
}

function resetColor() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {

            arr[i][j].style.color ="green";
        }
    }
}

var board=[[], [], [], [], [], [], [], [], []]

let button=document.getElementById('generate-sudoku')
let solve=document.getElementById('solve')

console.log(arr)
function changeBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {

                arr[i][j].innerText = board[i][j]

             }

            else

                arr[i][j].innerText = ''

        }
    }
}


button.onclick = function () {
    var xhrRequest = new XMLHttpRequest()
    xhrRequest.onload = function () {
        var response = JSON.parse(xhrRequest.response)
        console.log(response)
        initializeTemp(temp)
        resetColor()


        board = response.board
        setTemp(board, temp)
        setColor(temp)
        changeBoard(board)
    }

    xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy')
    //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
    xhrRequest.send()
}

//to be completed by student
function isSafe(board,row,col,number) {
     //check both rows & cols whether same number is present
    for (var x=0;x<9;x++) { 
        if (board[x][col]==number || board[row][x]==number){
            return false;
        }
    }

//check the subgrid in which current value of (row,col) whether it is present or not.

    var sx =row-row%3; //starting index of subgrid's x cordinate in which (i,j) exists
    var sy=col-col%3; //starting index of subgrid's y-cordinate in which (i,j) exists

    for (var i=sx;i<sx+3;i++){
        for (var j=sy;j<sy+3;j++){
            if (board[i][j]==number){
                return false;
            }
        }
    }
    return true; //if not found in this subgrid then it's true means we can safe to fill that number into that cell

}

//to be completed by student
function solveSudokuHelper(board,row,col) {
      //base case
    if (row== 9) {   //when we already hit the last cell of board i.e(8,8)
        changeBoard(board);
        return;
    }

    if (col== 9) {  //when in each row ,col 0 t0 8 ,when at last col,call another row with col value 0
        solveSudokuHelper(board, row + 1, 0)
        return;
    }

    if (board[row][col] != 0) {//skip all pre-filled cells i.e already that cells are filled with some values so means next call recursively 
        solveSudokuHelper(board,row,col + 1);
        return;
    }

  //here we are at inital row & col to fill value from 1 to 9 in the empty cells
    for (var number = 1; number <= 9; number++) {
        if (isSafe(board,row,col, number)) {
            board[row][col] = number;//we asusume this is the correct number temporarily if we are safe to fill that number in that cells 
            solveSudokuHelper(board,row,col+1);
            board[row][col] = 0; //backtracking i.e if the number is not suitable to fill in that position of the cell then back from that position with putting 0 value in that cell 
        }
    }
}

function solveSudoku(board){
    solveSudokuHelper(board, 0, 0)
}

solve.onclick = function(){
    solveSudoku(board);
}
