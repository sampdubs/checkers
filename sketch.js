const numSquares = 8;
let w;
let pieces = [];
let squareToPiece = {};
let redJumps = 0;
let blackJumps = 0;
let highlighted = [];
let selected;
let turn = false;

function setupBoard() {
	background(255);
	let black = false;
	noStroke();
	for (let i = 0; i < numSquares; i++) {
		for (let j = 0; j < numSquares; j++) {
			fill(black ? color(95, 87, 45) : color(210, 185, 114));
			rect(j * w, i * w, w, w);
			black = !black;
		}
		black = !black
	}

	let goodSquare = false;
	for (let i = 0; i < numSquares; i++) {
		for (let j = 0; j < 3; j++) {
			if (goodSquare) {
				const p = new Piece(i, j, "black");
				p.show();
				squareToPiece[coordToSquare(p.x, p.y)] = p;
				pieces.push(p);
			}
			goodSquare = !goodSquare
		}

		for (let j = numSquares - 3; j < numSquares; j++) {
			if (goodSquare) {
				const p = new Piece(i, j, "red");
				p.show();
				squareToPiece[coordToSquare(p.x, p.y)] = p;
				pieces.push(p);
			}
			goodSquare = !goodSquare;
		}
		goodSquare = !goodSquare
	}
}

function updateBoard() {
	background(255);
	let black = false;
	noStroke();
	for (let i = 0; i < numSquares; i++) {
		for (let j = 0; j < numSquares; j++) {
			fill(black ? color(95, 87, 45) : color(210, 185, 114));
			rect(j * w, i * w, w, w);
			black = !black;
		}
		black = !black
	}

	let blackMoves = 0;
	let redMoves = 0;
	for (let piece of pieces) {
		piece.show();
		const numMovesAndJumps = piece.getMoveOptions().length + piece.getJumpOptions(piece.x, piece.y, [])[1].length;
		piece.isBlack ? blackMoves += numMovesAndJumps : redMoves += numMovesAndJumps;
	}

	if (blackMoves == 0 && turn) redJumps = numSquares / 2 * 3;
	if (redMoves == 0 && !turn) blackJumps = numSquares / 2 * 3;

	if (blackJumps == numSquares / 2 * 3) {
		clear();
		textSize(150);
		textAlign(LEFT, TOP);
		fill(55);
		text("BLACK\nWINS!!", 0, 0);
	} else if (redJumps == numSquares / 2 * 3) {
		clear();
		textSize(150);
		textAlign(LEFT, TOP);
		fill(229, 102, 94);
		text("RED\nWINS!!", 0, 0);
	}
}

function setup() {
	createCanvas(600, 600);
	w = width / numSquares;
	fill(255);
	stroke(0);
	strokeWeight(4);
	rect(0, 0, width, height);
	setupBoard();
}

function getPiece(x, y) {
	if (coordToSquare(x, y) in squareToPiece) {
		return squareToPiece[coordToSquare(x, y)];
	}
	return;
}

function coordToSquare(x, y) {
	return `${x}, ${y}`;
}

function squareToCoord(square) {
	return createVector(Number(square.split(',')[0]), Number(square.split(',')[1]));
}

function squareIsGood(square) {
	const coord = squareToCoord(square);
	const x = coord.x;
	const y = coord.y;
	return x > -1 && x < numSquares && y > -1 && y < numSquares && !(square in squareToPiece);
}

function mousePressed() {
	updateBoard();
	let mouseBoxX = Math.floor(mouseX / w);
	let mouseBoxY = Math.floor(mouseY / w);
	let clicked = getPiece(mouseBoxX, mouseBoxY);

	if (clicked) {
		if (clicked.isBlack == turn) {
			clicked.showMoves();
			selected = clicked;
		}
	}
	for (let coord of highlighted) {
		if (mouseBoxX == coord.x && mouseBoxY == coord.y) {
			if (selected.isBlack == turn) {
				selected.move(coord.x, coord.y);
				break;
			}
		}
	}
}