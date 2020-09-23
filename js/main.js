
var MINE = '💣';
var FALG = '🚩';
var EMPTY = '';






var gCellId = 101;
var gBoard;





initGame();


function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}




function buildBoard() {
    var SIZE = 4;
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
    board[0][0].isMine = true;
    board[1][1].isMine = true;
    board[2][2].isMine = true;
    board[3][3].isMine = true;
    board[3][2].isMine = true;
    return board;
}




function renderBoard(board) {
    var strHTML = `<table><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            currCell = board[i][j];

            
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

function revealCell(id) {
    var cell = document.querySelector(`#cell-${id} span`);
    cell.style.display = 'block';
}



function cellClicked(elCell) {
    var id = elCell.slice(5, 8);
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].id === +id) {
                console.log('cell-'+gBoard[i][j].id);
                revealCell(id);
                return gBoard[i][j].id;
            }
        }
    }
    return null;
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









