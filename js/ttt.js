var playerTurn = false;
var gameOver = false;
var numNodes = 0;

var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

$(document).ready(function() {
    $("button").click(function() {
        var box = $(this).attr("id"),
            row = parseInt(box[1]),
            col = parseInt(box[2]);

        if (gameOver) {
          $(".game-status").replaceWith('Game over <br/> <a href=".">Play again?</a>');
          return;

        }

        if (board[row][col] !== null) {
          $(".game-status").text("Invalid move")
          return;
        }

        if (!playerTurn) {
          $(".game-status").text("")
            board[row][col] = false;
            playerTurn = true;
            updateBoard();
            playMove();
        }
    });
});

function updateBoard() {
    renderBoxes();

    var winner = checkWinner(board);
        winCheck = (winner === 1 || winner == 0 || winner === -1);

    if (winCheck) {
      gameOver = true;
      $(".game-status").text(winner === 1 ? "AI Wins!" : winner === 0 ? "You Win!" : winner === -1 ? "It's a tie!" : "");
      $(".game-status").append('<br/><a href=".">Play again?</a>')
    }
}

function checkWinner(board) {
    var posValues = [true, false],
        noNullValues = true;

    for (var k = 0; k < posValues.length; k++) {
        var value = posValues[k],
            diagCheck1 = true,
            diagCheck2 = true;

        for (var i = 0; i < 3; i++) {
            if (board[i][i] != value) {
                diagCheck1 = false;
            }
            if (board[2 - i][i] != value) {
                diagCheck2 = false;
            }
            var rowComplete = true;
            var colComplete = true;

            for (var j = 0; j < 3; j++) {
                if (board[i][j] != value) {
                    rowComplete = false;
                }
                if (board[j][i] != value) {
                    colComplete = false;
                }
                if (board[i][j] == null) {
                    noNullValues = false;
                }
            }
            if (rowComplete || colComplete) {
                return value ? 1 : 0;
            }
        }
        if (diagCheck1 || diagCheck2) {
            return value ? 1 : 0;
        }
    }
    if (noNullValues) {
        return -1;
    }
    return null;
}

function renderBoxes() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          $("#b" + i + "" + j).text(board[i][j] === false ? "x" : board[i][j] === true ? "o" : "");
        }
    }
}

function playMove() {
    board = findAIMove(board);

    playerTurn = false;
    updateBoard();
}

function findAIMove(board) {
    numNodes = 0;
    return recursiveFindAIMove(board, true)[1];
}

function recursiveFindAIMove(board, player) {
    numNodes++;
    var winner = checkWinner(board);

    if (winner != null) {
        switch(winner) {
            case 1:
                return [1, board]
            case 0:
                return [-1, board]
            case -1:
                return [0, board];
        }
    } else {
        var futureValue = null;
        var futureBoard = null;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === null) {
                    board[i][j] = player;
                    var value = recursiveFindAIMove(board, !player)[0];
                    if ((player && (futureValue == null || value > futureValue)) || (!player && (futureValue === null || value < futureValue))) {
                        futureBoard = board.map(function(array) {
                            return array.slice();
                        });
                        futureValue = value;
                    }
                    board[i][j] = null;
                }
            }
        }
        return [futureValue, futureBoard];
    }
}

updateBoard();
