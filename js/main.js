'use strict';


var MINE = '💣';
var FLAG = '🚩';

var gHintId;
var gHintTimeout;
var gIsHintOn;
var gMineRevealTimeout;
var gRevealMine;
var gMineDeleted;
var gTime;
var gTimerInterval;
var gLives;
var gToggle;
var gPosition = {
    i: 0,
    j: 0
};
var gCellId;
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

//who ever is viewing this, i know i should've use classList/add/remove for the styling,
//instead of doing it inside the js, but i realized it only at the end, sorry for the mess 

function initGame() {
    clearTimeout(gHintTimeout);
    clearTimeout(gMineRevealTimeout);
    gRevealMine = 3;
    gIsHintOn = false;
    gCellId = 101;
    gMineDeleted = 0;
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
            } else {
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
                    checkIfWon();
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
                if (gGame.showCount === 0 && gBoard[i][j].isMine) {
                    gBoard[i][j].isMine = false;
                    gMineDeleted++;
                    var smiley = document.querySelector('.smiley');
                    smiley.innerHTML = '😊';
                    renderBoard(gBoard)
                }
                if (gIsHintOn === true) {
                    revelHintCells(id, i, j);
                    gIsHintOn = false;
                } else {
                    gGame.showCount++;
                    gPosition = { i: i, j: j };
                    gBoard[i][j].isShowen = true;
                    revealCell(id);
                    checkIfWon();
                    numColors(i, j);
                }
            }
        }
    }
}



function revealCell(id) {
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
            if (cell.innerText === '0') {
                cell.innerText = '';
                expendShowen(board, i, j);
            }
            cell.style.display = 'block';
            cellNotSpan.style.backgroundColor = '#E8F5FF';
            cellNotSpan.style.border = 'none';
            numColors(i, j)
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
    if (+id === 24) {
        gLevel.size = 24;
        gLevel.mines = 90;
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
                    var mineExplore = setTimeout(function () {
                        cell.style.display = 'none';
                        cellBgc.style.backgroundColor = 'white'
                        cellBgc.style.border = '1px solid #e9e9e9';
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
                    gGame.isOn = false;
                    cell.style.display = 'block';
                    cellBgc.style.backgroundColor = '#FF7D7D';
                    cellBgc.style.border = 'none';
                    msg.innerHTML = `<h1>Game over</h1><button onclick="initGame()">restart</button>`;
                    var smiley = document.querySelector('.smiley');
                    smiley.innerHTML = '🤯';
                    clearTimeout(mineExplore);
                    clearInterval(gTimerInterval);
                }
            }
        }
    }
}


function checkIfWon() {
    var showenCount = getShowenCells();
    var livesUsed = 3 - gLives;
    if (showenCount - livesUsed === (gBoard.length ** 2) - (gLevel.mines - gMineDeleted) &&
        gGame.markedCount === (gLevel.mines - gMineDeleted)) {

        var msg = document.querySelector('.msg');
        msg.innerHTML = `<h1>VICTORY!🥇</h1><button onclick="initGame()">play again</button>`;
        var smiley = document.querySelector('.smiley');
        smiley.innerHTML = '😎';
        gGame.isOn = false;
    }
    clearInterval(gTimerInterval);
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


function revealMine() {
    if (gRevealMine !== 0) {
        for (var i = getRandomIntInclusive(0, gBoard.length - 1); i < gBoard.length; i++) {
            for (var j = getRandomIntInclusive(0, gBoard.length - 1); j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                    var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
                    var cellBgc = document.querySelector(`#cell-${gBoard[i][j].id}`);
                    cell.style.display = 'block';
                    gMineRevealTimeout = setTimeout(function () {
                        cell.style.display = 'none';
                        cellBgc.style.backgroundColor = 'white'
                        cellBgc.style.border = '1px solid #e9e9e9';
                    }, 1000);
                    gRevealMine--;
                    var safeClick = document.querySelector('.safe-click button');
                    safeClick.innerHTML = 'Safe Click: ' + gRevealMine;
                    return;
                }
            }
        }
        clearTimeout(gMineRevealTimeout);
    }
}



function setHintOn(idBtn) {
    var elHint = document.querySelector(`#${idBtn}`);
    if (elHint.classList.contains('bulb-light')) {
        elHint.classList.remove('bulb-light');
        gIsHintOn = false;
    } else {
        elHint.classList.add('bulb-light');
        gIsHintOn = true;
        gHintId = idBtn;
    }
}



//works only with 1 cell 
function revelHintCells(id, i, j) {
    var cell = document.querySelector(`#cell-${id} span`);
    var cellBgc = document.querySelector(`#cell-${id}`);
    cell.style.display = 'block';
    cellBgc.style.backgroundColor = '#E8F5FF';
    numColors(i, j)
    setTimeout(function () {
        cell.style.display = 'none';
        cellBgc.style.backgroundColor = 'white'
    }, 1000);

    var elHint = document.querySelector(`#${gHintId}`);
    elHint.classList.remove('bulb-light');
    elHint.style.display = 'none';
    clearTimeout(gHintTimeout);
}



function showLives() {
    if (gLives === 3) return '💗💗💗';
    if (gLives === 2) return '💗💗';
    if (gLives === 1) return '💗';
    if (gLives === 0) return '0 Lives';
}



function timer() {
    if (gGame.isOn && gGame.showCount > 0) {
        var elTimer = document.querySelector('.timer');
        elTimer.innerHTML = 'Time: ' + gTime++ + 's';
    }
}

function getShowenCells() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShowen === true) {
                count++;
            }
        }
    }
    return count;
}


function resetDOM() {
    var hint1 = document.querySelector('.bulb #hint1');
    var hint2 = document.querySelector('.bulb #hint2');
    var hint3 = document.querySelector('.bulb #hint3');
    hint1.classList.remove('bulb-light');
    hint2.classList.remove('bulb-light');
    hint3.classList.remove('bulb-light');
    hint1.style.display = 'block';
    hint2.style.display = 'block';
    hint3.style.display = 'block';
    hint1.innerHTML = '💡';
    hint2.innerHTML = '💡';
    hint3.innerHTML = '💡';
    var msg = document.querySelector('.msg');
    msg.innerHTML = '';
    var livesMsg = document.querySelector('.lives');
    livesMsg.innerText = showLives();
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = 'Time: 0s';
    var smiley = document.querySelector('.smiley');
    smiley.innerHTML = '😊';
    var safeClick = document.querySelector('.safe-click button');
    safeClick.innerHTML = 'Safe Click: ' + gRevealMine;
}



function numColors(i, j) {
    var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
    if (cell.innerText === '1') cell.style.color = 'blue';
    if (cell.innerText === '2') cell.style.color = 'green';
    if (cell.innerText === '3') cell.style.color = 'red';
    if (cell.innerText === '4') cell.style.color = 'purple';
    if (cell.innerText === '5') cell.style.color = 'maroon';
    if (cell.innerText === '6') cell.style.color = 'turquoise';
}


function getData() {
    console.log('/////////////////////////////////////');
    console.log('gGame.markedCount:', gGame.markedCount);
    console.log('gLevel.mines:', gLevel.mines);
    console.log('gGame.showCount:', gGame.showCount, 'getShwoenCells():', getShowenCells());
    console.log('gBoard.length:', gBoard.length ** 2);
    console.log('gGame.isOn: ', gGame.isOn);
    console.log('/////////////////////////////////////');
}












// function revelHintCells(id, board, posI, posJ) {
//     var cell = document.querySelector(`#cell-${id} span`);
//     var cellNotSpan = document.querySelector(`#cell-${id}`);
//     for (var i = posI - 1; i <= posI + 1; i++) {
//         if (i < 0 || i >= board.length) continue;
//         for (var j = posJ - 1; j <= posJ + 1; j++) {
//             if (j < 0 || j >= board.length) continue;
//             var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
//             var cellNotSpan = document.querySelector(`#cell-${gBoard[i][j].id}`);
//             if (cell.innerText === '0') cell.innerText = '';
//             cell.style.display = 'block';
//             cellNotSpan.style.backgroundColor = '#E8F5FF';
//             cellNotSpan.style.border = 'none';
//             numColors(i, j);
//             gHintTimeout = setTimeout(function () {
//                 for (var i = posI - 1; i <= posI + 1; i++) {
//                     if (i < 0 || i >= board.length) continue;
//                     for (var j = posJ - 1; j <= posJ + 1; j++) {
//                         if (j < 0 || j >= board.length) continue;
//                         var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
//                         var cellNotSpan = document.querySelector(`#cell-${gBoard[i][j].id}`);
//                         if (board[i][j].isShowen) {
//                             continue;
//                         } else {
//                             cell.innerText = '0';
//                             cell.style.display = 'none';
//                             cellNotSpan.style.backgroundColor = 'white';
//                             cellNotSpan.style.border = '1px solid #e9e9e9';
//                         }
//                     }
//                 }
//             }, 1000)
//         }
//     }
//     var elHint = document.querySelector(`#${gHintId}`);
//     elHint.classList.remove('bulb-light');
//     elHint.style.display = 'none';
//     clearTimeout(gHintTimeout);
// }
// function setHintOn(idBtn) {
//     var elHint = document.querySelector(`#${idBtn}`);
//     elHint.classList.add('bulb-light');
//     gIsHintOn = true;
// }
// function revelHintCells(id) {
//     var cell = document.querySelector(`#cell-${id} span`);
//     var cellNotSpan = document.querySelector(`#cell-${id}`);
//     if (cell.innerText !== '0') {
//         cell.style.display = 'block';
//         cellNotSpan.style.border = 'none';
//         cellNotSpan.style.backgroundColor = '#E8F5FF'
//         setTimeout(function(){
//             cell.style.display = 'none';
//         },1000)
//     }
// }
// function revealHintCells(board,i,j){
//     expendShowen(board,i,j);
//     gHintInterval = setTimeout(function () {
//         hideAllCells();
//     }, 1000);
//     gIsHintOn = false;
// }
// function showHintCells(id) {
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[i].length; i++) {
//             if (gIsHintOn === true) {
//                 console.log('reveal cell now');
//             }
//         }
//     }
// }
// cellNotSpan.style.backgroundColor = '#FDF5E6';
// cellNotSpan.style.backgroundColor = '#E8F5FF';
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
// function test(board, posI, posJ) {
//     if (board[posI][posJ].minesAroundCount === 0) {
//         for (var i = posI - 1; i <= posI + 1; i++) {
//             if (i < 0 || i >= board.length) continue;
//             for (var j = posJ - 1; j <= posJ + 1; j++) {
//                 if (j < 0 || j >= board.length) continue;
//                 board[i][j].isShowen = true;
//                 var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
//                 var cellNotSpan = document.querySelector(`#cell-${gBoard[i][j].id}`);
//                 if (cell.style.display === 'none') {
//                     gGame.showCount++;
//                 }
//                 if (cell.innerText === '0') {
//                     cell.innerText = '';
//                     test(board, i, j)
//                 }
//                 cell.style.display = 'block';
//                 cellNotSpan.style.backgroundColor = '#E8F5FF';
//                 cellNotSpan.style.border = 'none';
//             }
//         }
//     }
// }
// function expendShowen(board, posI, posJ) {
//     for (var i = posI - 1; i <= posI + 1; i++) {
//         if (i < 0 || i >= board.length) continue;
//         for (var j = posJ - 1; j <= posJ + 1; j++) {
//             if (j < 0 || j >= board.length) continue;
//             board[i][j].isShowen = true;
//             var cell = document.querySelector(`#cell-${gBoard[i][j].id} span`);
//             var cellNotSpan = document.querySelector(`#cell-${gBoard[i][j].id}`);
//             if (cell.style.display === 'none') {
//                 gGame.showCount++;
//             }
//             if (cell.innerText === '0') {
//                 cell.innerText = '';
//             }
//             cell.style.display = 'block';
//             cellNotSpan.style.backgroundColor = '#E8F5FF';
//             cellNotSpan.style.border = 'none';
//         }
//     }
// }
// var msg = document.querySelector('.msg');
//         msg.innerHTML = `<h1>VICTORY!🥇</h1><button onclick="initGame()">play again</button>`;
//         var smiley = document.querySelector('.smiley');
//         smiley.innerHTML = '😎';
//         gGame.isOn = false;
//         clearInterval(gTimerInterval);
// function checkIfWon() {
//     var showenCount = 0;
//     var flagCount = 0
//     var mineCount = 0;
//     var livesUsed = 3 - gLives;
//     var boardSize = gBoard.length ** 2;
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[i].length; j++) {
//             if (gBoard[i][j].isShowen === true) showenCount++;
//             if (gBoard[i][j].isMarked === true) flagCount++;
//             if (gBoard[i][j].isMine === true) mineCount++;
//         }
//     }
//     if (flagCount === mineCount && mineCount === gLevel.mines && showenCount - livesUsed === (boardSize) - (gLevel.mines)) {
//         var msg = document.querySelector('.msg');
//         msg.innerHTML = `<h1>VICTORY!🥇</h1><button onclick="initGame()">play again</button>`;
//         var smiley = document.querySelector('.smiley');
//         smiley.innerHTML = '😎';
//         gGame.isOn = false;
//         clearInterval(gTimerInterval);
//     }
// }