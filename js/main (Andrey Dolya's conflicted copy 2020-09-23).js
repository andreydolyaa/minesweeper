
var MINE = 'mine';






var gCellId = 101;
var gBoard;





initGame();


function initGame() {
    gBoard = buildBoard();
    setMinesNegsCount(gBoard)
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
                isShowen: true,
                isMine: false,
                isMarked: true,
            };
            board[i][j] = cell;
        }
    }
    // board[0][0].isMine = true;
    board[1][1].isMine = true;
    // board[2][2].isMine = true;
    board[3][3].isMine = true;
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
                strHTML += `<td class="cell" id="cell-${i}${j}" data-cell="${i}" onclick="cellClicked(this.id)">${mine}</td>`
            } else {
                strHTML += `<td class="cell" id="cell-${i}${j}" data-cell="${i}" onclick="cellClicked(this.id)">${currCell.minesAroundCount}</td>`
            }
        }
        strHTML += `</tr>`;
    }
    strHTML += `</tbody></table>`;
    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHTML;
}





function setMinesNegsCount(board,posI,posJ) {
    for(var i =)
}


// function countNegsAround(pos, item) {
//     var count = 0;
//     for (var i = pos.i-1; i <= pos.i+1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = pos.j-1; j <= pos.j+1; j++) {
//             if (j < 0 || j >= gBoard[i].length) continue;
//             if (pos.i === i && pos.j === j) continue;
//             var cell = gBoard[i][j];
//             if (cell === item) count++;
//             console.log(cell);
//         }
//     }
//     return count;
// }






function cellClicked(elCell, i, j) {
    console.log(elCell);

}



