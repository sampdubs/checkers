class Piece {

    constructor(x, y, col) {
        this.x = x;
        this.y = y;
        this.posX = x * w + w / 2;
        this.posY = y * w + w / 2;
        this.color = col;
        this.col = col == 'red' ? color(229, 102, 94) : 55;
        this.isBlack = col == 'black';
        this.isQueen = false;
    }

    show() {
        this.posX = this.x * w + w / 2;
        this.posY = this.y * w + w / 2;
        noStroke();
        fill(this.col);
        ellipse(this.posX, this.posY, w * 0.9)
        if (this.isQueen) {
            stroke(0);
            strokeWeight(5);
            ellipse(this.posX, this.posY, w * 0.7);
        }
    }

    getMoveOptions() {
        let moves = [];
        let curCheck = coordToSquare(this.x - 1, this.isBlack ? this.y + 1 : this.y - 1);
        if (squareIsGood(curCheck)) moves.push(squareToCoord(curCheck));
        curCheck = coordToSquare(this.x + 1, this.isBlack ? this.y + 1 : this.y - 1);
        if (squareIsGood(curCheck)) moves.push(squareToCoord(curCheck));

        if (this.isQueen) {
            curCheck = coordToSquare(this.x - 1, this.isBlack ? this.y - 1 : this.y + 1);
            if (squareIsGood(curCheck)) moves.push(squareToCoord(curCheck));
            curCheck = coordToSquare(this.x + 1, this.isBlack ? this.y - 1 : this.y + 1);
            if (squareIsGood(curCheck)) moves.push(squareToCoord(curCheck));
        }

        this.moves = moves;
        return moves;
    }

    getJumpOptions(x, y, taken) {
        let jumps = [
            [],
            []
        ];
        let curCheck = coordToSquare(x + 1, this.isBlack ? y + 1 : y - 1);
        let jumpSquare = coordToSquare(x + 2, this.isBlack ? y + 2 : y - 2);
        if (taken.indexOf(jumpSquare) == -1) {
            if (curCheck in squareToPiece && squareToPiece[curCheck].color !== this.color && squareIsGood(jumpSquare)) {
                jumps[0].push([squareToCoord(curCheck)]);
                jumps[1].push(squareToCoord(jumpSquare));
            }
        }
        curCheck = coordToSquare(x - 1, this.isBlack ? y + 1 : y - 1);
        jumpSquare = coordToSquare(x - 2, this.isBlack ? y + 2 : y - 2);
        if (taken.indexOf(jumpSquare) == -1) {
            if (curCheck in squareToPiece && squareToPiece[curCheck].color !== this.color && squareIsGood(jumpSquare)) {
                jumps[0].push([squareToCoord(curCheck)]);
                jumps[1].push(squareToCoord(jumpSquare));
            }
        }
        if (this.isQueen) {
            curCheck = coordToSquare(x + 1, this.isBlack ? y - 1 : y + 1);
            jumpSquare = coordToSquare(x + 2, this.isBlack ? y - 2 : y + 2);
            if (taken.indexOf(jumpSquare) == -1) {
                if (curCheck in squareToPiece && squareToPiece[curCheck].color !== this.color && squareIsGood(jumpSquare)) {
                    jumps[0].push([squareToCoord(curCheck)]);
                    jumps[1].push(squareToCoord(jumpSquare));
                }
            }
            curCheck = coordToSquare(x - 1, this.isBlack ? y - 1 : y + 1);
            jumpSquare = coordToSquare(x - 2, this.isBlack ? y - 2 : y + 2);
            if (taken.indexOf(jumpSquare) == -1) {
                if (curCheck in squareToPiece && squareToPiece[curCheck].color !== this.color && squareIsGood(jumpSquare)) {
                    jumps[0].push([squareToCoord(curCheck)]);
                    jumps[1].push(squareToCoord(jumpSquare));
                }
            }
        }

        if (jumps[1].length > 0) {
            for (let i = 0; i < jumps[1].length; i++) {
                let jumpsInSqares = [];
                for (let jump of jumps[1]) {
                    jumpsInSqares.push(coordToSquare(jump.x, jump.y));
                }
                jumpsInSqares = jumpsInSqares.concat(taken);
                const jumpsFromThere = this.getJumpOptions(jumps[1][i].x, jumps[1][i].y, jumpsInSqares);
                for (let j = 0; j < jumpsFromThere[1].length; j++) {
                    jumps[0].push(jumps[0][i].concat(jumpsFromThere[0][j]));
                    jumps[1].push(jumpsFromThere[1][j]);
                }
            }
        }
        this.jumps = jumps;
        return jumps;
    }

    showMoves() {
        noStroke();
        highlighted = [];
        const moves = this.getMoveOptions();
        for (let move of moves) {
            fill(0, 255, 0, 80);
            rect(move.x * w, move.y * w, w, w);
            highlighted.push(move);
        }

        const jumps = this.getJumpOptions(this.x, this.y, []);
        for (let jump of jumps[1]) {
            fill(0, 255, 0, 80);
            rect(jump.x * w, jump.y * w, w, w);
            highlighted.push(jump);
        }

    }

    move(x, y) {
        delete squareToPiece[coordToSquare(this.x, this.y)];
        if (abs(x - this.x) > 1 || abs(y - this.y) > 1) {
            for (let i = 0; i < this.jumps[1].length; i++) {
                if (this.jumps[1][i].x == x && this.jumps[1][i].y == y) {
                    const jumpedPieces = this.jumps[0][i];
                    for (let jumped of jumpedPieces) {
                        delete squareToPiece[coordToSquare(jumped.x, jumped.y)];
                        for (let j = 0; j < pieces.length; j++) {
                            if (pieces[j].x == jumped.x && pieces[j].y == jumped.y) {
                                pieces.splice(j, 1);
                            }
                        }
                        this.isBlack ? blackJumps++ : redJumps++;
                    }
                }
            }
        }
        this.x = x;
        this.y = y;
        if (this.y == (this.isBlack ? numSquares - 1 : 0)) {
            this.isQueen = true;
        }
        turn = !this.isBlack;
        squareToPiece[coordToSquare(this.x, this.y)] = this;
        updateBoard();
    }

}