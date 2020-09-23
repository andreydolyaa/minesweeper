'use strict';


var MINE = '💣';
var FALG = '🚩';
var EMPTY = '';





var gPosition = {
    i: 0,
    j: 0
};
var gCellId = 101;
var gBoard;
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0
};








function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}




function buildBoard() {
    var SIZE = gLevel.size;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShowen: false,
                isMine: false,
                isMarked: true,
                id: gCellId++
            };
            board[i][j] = cell;
        }
    }

    createMines(board);
    // board[0][0].isMine = true;
    // board[1][1].isMine = true;
    // board[2][2].isMine = true;
    // board[3][3].isMine = true;
    // board[3][2].isMine = true;
    return board;
}




function renderBoard(board) {
    var strHTML = `<table><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];

            if (currCell.isMine === true) {
                var mine = MINE;
                strHTML += `<td class="cell" id="cell-${currCell.id}" onclick="cellClicked(this.id)"><span>${mine}</span></td>`
            }
            else {
                strHTML += `<td class="cell" id="cell-${currCell.id}"
                 onclick="cellClicked(this.id)"><span>${currCell.minesAroundCount = setMinesNegsCount(board, i, j)}</span></td>`
            }

        }
        strHTML += `</tr>`;
    }
    strHTML += `</tbody></table>`;
    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHTML;
    hideAllCells();
}





function hideAllCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShowen === false) {
                var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
                cell.style.display = 'none';
            }
        }
    }
}






function cellClicked(elCell) {
    var id = elCell.slice(5, 8);
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].id === +id) {
                gPosition = { i: i, j: j };
                revealCell(id);
                gBoard[i][j].isShowen = true;
            }
        }
    }
    return null;
}





function revealCell(id) {
    var currIdx = gBoard[gPosition.i][gPosition.j];
    var cell = document.querySelector(`#cell-${id} span`);
    if (cell.innerText !== '0') {
        cell.style.display = 'block';
        currIdx.isShowen = true;
        console.log(gBoard);
    }
    if (cell.innerText === '0') {
        expendShowen(gBoard, gPosition.i, gPosition.j);
        console.log(gBoard);
    }
    if (cell.innerText === MINE) {
        cell.innerText += 'bomb!'
        currIdx.isShowen = true;
        console.log(gBoard);
    }
}





function expendShowen(board, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            board[i][j].isShowen = true;
            var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
            var cellNotSpan = document.querySelector(`#cell-${gBoard[i][j].id}`);
            cell.style.display = 'block';
            cellNotSpan.style.backgroundColor = '#FFE4C4';
        }
    }
}




function createMines(board) {
    var count = 0;
    while (count !== gLevel.mines) {
        board[getRandomIntInclusive(0, board.length - 1)][getRandomIntInclusive(0, board.length - 1)].isMine = true;
        count++;
    }
}






function setLevel(id) {
    if (+id === 4) {
        gLevel.size = 4;
        gLevel.mines = 2;
    }
    if (+id === 8) {
        gLevel.size = 8;
        gLevel.mines = 12;
    }
    if (+id === 12) {
        gLevel.size = 12;
        gLevel.mines = 30;
    }
    initGame();
}






function setMinesNegsCount(board, posI, posJ) {
    var count = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (posI === i && posJ === j) continue;
            if (board[i][j].isMine === true) {
                count++;
            }
        }
    }
    return count;
}








// function revealCell(id) {
//     var cell = document.querySelector(`#cell-${id} span`);
//     cell.style.display = 'block';
// }





// if (board[i][j].minesAroundCount > 0) {
//     cell = document.querySelector(`#cell-${id} span`);
//     cell.style.display = 'block';
// }





