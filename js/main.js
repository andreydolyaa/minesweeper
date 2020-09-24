'use strict';


var MINE = '💣';
var FLAG = '🚩';
var EMPTY = '';

var gTime;
var gTimerInterval;
var gLives;
var gToggle;
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
    gTime = 0;
    gLives = 3;
    gGame.showCount = 0;
    gGame.markedCount = 0;
    gGame.isOn = true;
    resetDOM();
    gBoard = buildBoard();
    renderBoard(gBoard);
    gTimerInterval = setInterval(timer, 1000);
    checkGameOver();
}


function getData() {
    console.log('/////////////////////////////////////');
    console.log('gGame.markedCount:', gGame.markedCount);
    console.log('gLevel.mines:', gLevel.mines);
    console.log('gGame.showCount:', gGame.showCount);
    console.log('gBoard.length:', gBoard.length ** 2);
    console.log('gGame.isOn: ', gGame.isOn);
    console.log('/////////////////////////////////////');
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
                isMarked: false,
                id: gCellId++
            };
            board[i][j] = cell;
        }
    }
    // board[0][0].isMine = true;
    // board[1][1].isMine = true;
    // board[2][2].isMine = true;
    // board[3][3].isMine = true;
    // board[3][2].isMine = true;
    createMines(board);
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
                strHTML += `<td class="cell" id="cell-${currCell.id}" oncontextmenu="cellMarked(this.id);return false"
                 onclick="cellClicked(this.id)"><span>${mine}</span></td>`
            }
            else {
                strHTML += `<td class="cell" id="cell-${currCell.id}" oncontextmenu="cellMarked(this.id);return false" 
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


function cellMarked(elCell) {
    gToggle = gBoard.slice();
    var id = elCell.slice(5, 8);
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (+id === gBoard[i][j].id) {
                if (gBoard[i][j].isMarked === false) {
                    var cell = document.querySelector(`#cell-${id} span`);
                    var cellNotSpan = document.querySelector(`#cell-${id}`);
                    cell.innerText = FLAG;
                    cell.style.display = 'block';
                    cellNotSpan.style.border = 'none';
                    cellNotSpan.style.backgroundColor = '#E8F5FF'
                    gBoard[i][j].isMarked = true;
                    gGame.markedCount++;
                } else {
                    gBoard[i][j].isMarked = false;
                    flagToggle(i, j);
                    gGame.markedCount--;
                }
            }
        }
    }
}


function flagToggle(posI, posJ) {
    if (gToggle[posI][posJ].isMine === true) {
        var cell = document.querySelector(`#cell-${gToggle[posI][posJ].id} span`);
        var cellBgc = document.querySelector(`#cell-${gToggle[posI][posJ].id}`);
        cellBgc.style.backgroundColor = 'white';
        cell.innerText = MINE;
        cell.style.display = 'none';
    }
    else if (gToggle[posI][posJ].minesAroundCount === 0) {
        cell = document.querySelector(`#cell-${gToggle[posI][posJ].id} span`);
        cellBgc = document.querySelector(`#cell-${gToggle[posI][posJ].id}`);
        cellBgc.style.backgroundColor = 'white';
        cell.innerText = gToggle[posI][posJ].minesAroundCount;
        cell.style.display = 'none';
    }
    else if (gToggle[posI][posJ].minesAroundCount > 0) {
        cell = document.querySelector(`#cell-${gToggle[posI][posJ].id} span`);
        cellBgc = document.querySelector(`#cell-${gToggle[posI][posJ].id}`);
        cellBgc.style.backgroundColor = 'white';
        cell.innerText = gToggle[posI][posJ].minesAroundCount;
        cell.style.display = 'none';
    }
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
                checkIfWon();
                getData();
            }
        }
    }
    return null;
}


function revealCell(id) {
    var currIdx = gBoard[gPosition.i][gPosition.j];
    var cell = document.querySelector(`#cell-${id} span`);
    var cellNotSpan = document.querySelector(`#cell-${id}`);
    if (cell.innerText !== '0') {
        if (cell.style.display === 'none') {
            gGame.showCount++;
        }
        cell.style.display = 'block';
        cellNotSpan.style.border = 'none';
        cellNotSpan.style.backgroundColor = '#E8F5FF'
    }
    if (cell.innerText === '0') {
        expendShowen(gBoard, gPosition.i, gPosition.j);
    }
    if (cell.innerText === MINE) {
        gLives--;
        gGame.showCount--;
        checkGameOver();
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
            if (cell.style.display === 'none') {
                gGame.showCount++;
            }
            if (cell.innerText === '0') {
                cell.innerText = '';
            }
            cell.style.display = 'block';
            cellNotSpan.style.backgroundColor = '#E8F5FF';
            cellNotSpan.style.border = 'none';
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
    clearInterval(gTimerInterval)
}


function checkGameOver() {
    var currIdx = gBoard[gPosition.i][gPosition.j];
    var currId = gBoard[gPosition.i][gPosition.j].id;
    if (currIdx.isMine && gLives >= 0) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (+currId === gBoard[i][j].id) {
                    var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
                    var cellBgc = document.querySelector(`#cell-${gBoard[i][j].id}`);
                    var livesMsg = document.querySelector('.lives');
                    livesMsg.innerText = showLives();
                    console.log(gLives);
                    var mineExplore = setTimeout(function () {
                        cell.style.display = 'none';
                        cellBgc.style.backgroundColor = 'white'
                        var smiley = document.querySelector('.smiley');
                        smiley.innerHTML = '🤯';
                    }, 1000);
                }
            }
        }
    }
    if (currIdx.isMine && gLives === 0) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMine === true) {
                    var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
                    var cellBgc = document.querySelector(`#cell-${gBoard[i][j].id}`);
                    var msg = document.querySelector('.msg');
                    cell.style.display = 'block';
                    cellBgc.style.backgroundColor = '#FF7D7D';
                    msg.innerHTML = `<h1>Game over</h1><button onclick="initGame()">restart</button>`;
                    var smiley = document.querySelector('.smiley');
                    smiley.innerHTML = '🤯';
                    clearTimeout(mineExplore);
                    gGame.isOn = false;
                    clearInterval(gTimerInterval);
                }
            }
        }
    }
}


function checkIfWon() {
    if (gBoard.length ** 2 === gGame.showCount + gGame.markedCount) {
        var msg = document.querySelector('.msg');
        msg.innerHTML = `<h1>VICTORY!🥇</h1><button onclick="initGame()">play again</button>`;
        var smiley = document.querySelector('.smiley');
        smiley.innerHTML = '😎';
        gGame.isOn = false;
        clearInterval(gTimerInterval);
    }
}



function resetDOM() {
    var msg = document.querySelector('.msg');
    msg.innerHTML = '';
    var livesMsg = document.querySelector('.lives');
    livesMsg.innerText = showLives();
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = 'Time: 0s';
    var smiley = document.querySelector('.smiley');
    smiley.innerHTML = '😊';
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


function showLives() {
    if (gLives === 3) return '💗💗💗';
    if (gLives === 2) return '💗💗';
    if (gLives === 1) return '💗';
    if (gLives === 0) return 'no lives left 💀';
}



function timer() {
    if (gGame.isOn && gGame.showCount > 0) {
        var elTimer = document.querySelector('.timer');
        elTimer.innerHTML = 'Time: ' + gTime++ + 's';
    }
}




// if (cell.style.display === 'none') {
//     gGame.showCount++;
// }

// function revealCell(id) {
//     var cell = document.querySelector(`#cell-${id} span`);
//     cell.style.display = 'block';
// }





// if (board[i][j].minesAroundCount > 0) {
//     cell = document.querySelector(`#cell-${id} span`);
//     cell.style.display = 'block';
// }



//placeFlag
// function cellMarked(elCell) {
//     var id = elCell.slice(5, 8);
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[i].length; j++) {
//             gToggle = gBoard.slice();

//             if (+id === gBoard[i][j].id) {
//                 gBoard[i][j].isMarked = true;
//                 gGame.markedCount++;
//             }
//             if (gBoard[i][j].isMarked === true) {
//                 var cell = document.querySelector(`#cell-${id} span`);
//                 cell.innerText = FLAG;
//                 cell.style.display = 'block';
//                 console.log(gToggle);
//             }
//         }
//     }
// }

