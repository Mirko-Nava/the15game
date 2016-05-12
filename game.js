var Game = {};
(function(game) {

	var canvas_x, canvas_y;
	var width = 480;
	var height = 480;
	var side_length = width / 4;
	var side_border = 3;
	var font_margin = 30;
	var font_size = side_length - font_margin;

	var context;
	var board;
	var playing;

	function near(i1, i2) {
		var y1 = Math.floor(i1 / 4),
			x1 = i1 - y1 * 4,
			y2 = Math.floor(i2 / 4),
			x2 = i2 - y2 * 4,
			dx = Math.abs(x1 - x2),
			dy = Math.abs(y1 - y2);
		return dx + dy === 1;
	}

	game.start = function() {

		function scramble() {
			board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

			var times = 50 +  Math.floor(Math.random() * 50);
			var index, empty = 15;

			for (var i = 0; i < times; i++) {
				index = Math.floor(Math.random() * 15);

				if (near(index, empty)) {
					temp = board[index];
					board[index] = board[empty];
					board[empty] = temp;
					empty = index;
				}
				else {
					i--;
				}
			}
		}

		var canvas = document.getElementsByTagName("canvas")[0];

		document.body.style.width = "70%";
		document.body.style.margin = "auto";
		document.body.style["text-align"] = "center";

		canvas.style.border = "3px solid black"
		canvas.style.width = width + "px";
		canvas.style.height = height  + "px";
		canvas.width = width;
		canvas.height = height;
		canvas.onclick = game.input;

		if (!context) {
			context = canvas.getContext("2d");
		}

		context.font = font_size + "px Arial";
		context.lineWidth = side_border;

		if (!(canvas_x || canvas_y)) {
			canvas_x = canvas.getBoundingClientRect().x;
			canvas_y = canvas.getBoundingClientRect().y;
		}

		playing = true;
		scramble();
		game.draw();
	}

	game.input = function(event) {

		function get_cell_index(event) {
			var y = Math.floor((event.clientX - canvas_x - 1) / side_length);
			var x = Math.floor((event.clientY - canvas_y - 1) / side_length);
			return x * 4 + y;
		}

		function get_empty_cell() {
			for (var i = 0; i < 16; i++) {
				if (board[i] === 16) {
					return i;
				}
			}
		}

		function win() {
			for (var i = 1; i <= 16; i++) {
				if (board[i - 1] !== i) {
					return false;
				}
			}
			return true;
		}

		if (playing) {
			var selected = get_cell_index(event);
			var empty = get_empty_cell();

			if (near(selected, empty)) {

				temp = board[selected];
				board[selected] = board[empty];
				board[empty] = temp;

				game.draw();

				if (win()) {
					playing = false;
					setTimeout(game.victory, 800);
				}
			}
		}
	}

	game.draw = function() {

		function draw_cell(i, j, n) {
			var s = n.toString();
			var x = i * side_length;
			var y = j * side_length;

			if (n < 16) {
				context.fillStyle = "#dea66e";
				context.fillRect(x, y, side_length - side_border / 2, side_length - side_border / 2);

				context.fillStyle = "#0d0515";
				context.strokeRect(x, y, side_length, side_length);

				context.fillStyle = "#0d0515";
				var maring_x = font_margin * (s.length === 2 ? 0.5 : 1);
				context.fillText(s, x + maring_x, y + side_length - font_margin);
			}
			else if (n === 16) {
				context.fillStyle = "#000000";
				context.fillRect(x, y, side_length, side_length);
			}
		}

		board.forEach(function(n, index) {
			var j = Math.floor(index / 4);
			var i = index - j * 4;
			draw_cell(i, j, n);
		});
	}

	game.victory = function() {
		context.fillStyle = "#fef8cd";
		context.fillRect(0, 0, width, height);

		context.font = "60px Arial"
		context.fillStyle = "#0d0515";
		context.fillText("Victory!", 60, 120);

		setTimeout(game.start, 1200);
	}

}(Game))