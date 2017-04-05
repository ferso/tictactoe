/*  A simple Tic-Tac-Toe game implemented in Javascript V8 3.14.5.9

Players 'X' and 'O' take turn inputing their position on the command line using numbers 1-9

1 | 2 | 3
---------
4 | 5 | 6
---------
7 | 8 | 9

*/


// prompt for nodejs is required: https://github.com/flatiron/prompt
// npm install prompt
var prompt = require('prompt');

var board = {
    1: ' ',
    2: ' ',
    3: ' ',
    4: ' ',
    5: ' ',
    6: ' ',
    7: ' ',
    8: ' ',
    9: ' '
};

function markBoard(position, mark) {
    board[position] = mark.toUpperCase();
}

function printBoard() {
    console.log('\n' +
        ' ' + board[1] + ' | ' + board[2] + ' | ' + board[3] + '\n' +
        ' ---------\n' +
        ' ' + board[4] + ' | ' + board[5] + ' | ' + board[6] + '\n' +
        ' ---------\n' +
        ' ' + board[7] + ' | ' + board[8] + ' | ' + board[9] + '\n');

}

function isInt(value) {
    var x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

function validateMove(position) {
    if (isInt(position) === true && board[position] === ' ') {
        return true;
    }
    return false;
}

// Everyone possible combination of three in a row
var winCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7],
                       [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

// Determins if the passed in player has three in a row
function checkWin(player) {
    for (var i = 0; i < winCombinations.length; i++) {
        var markCount = 0;
        for (var j = 0; j < winCombinations[i].length; j++) {
            if (board[winCombinations[i][j]] === player) {
                markCount++;
            }
            if (markCount === 3) {
                return true;
            }
        }
    }
    return false;
}

function playTurn(player) {

    console.log('Your turn player: ' + player);
    prompt.start();
    prompt.get(['position'], function (err, result) {

        if (validateMove(result.position) === true) {
            markBoard(result.position, player);
            printBoard();
            if (checkWin(player) === true) {
                console.log('Winner Winner!');
                return;
            }
            if (player === 'X') {
                playTurn('O');
            } else {
                playTurn('X');
            }
        } else {
            console.log('incorrect input please try again...');
            playTurn(player);
        }
    });
}

console.log('Game started: \n' +
    ' 1 | 2 | 3 \n' +
    ' --------- \n' +
    ' 4 | 5 | 6 \n' +
    ' --------- \n' +
    ' 7 | 8 | 9 \n');


playTurn('X');