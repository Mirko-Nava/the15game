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
	var status;
	var menu_btns = [];
	var win_btns = [];

	function near(i1, i2) {
		var y1 = Math.floor(i1 / 4),
			x1 = i1 - y1 * 4,
			y2 = Math.floor(i2 / 4),
			x2 = i2 - y2 * 4,
			dx = Math.abs(x1 - x2),
			dy = Math.abs(y1 - y2);
		return dx + dy === 1;
	}

	function inside(x, y, rect) {
		return x > rect.x && x < (rect.x + rect.width) && y > rect.y && y < (rect.y + rect.height);
	}

	function draw_btns(btns) {
		btns.forEach(function(btn) {
			context.fillStyle = btn.bg_color;
			context.fillRect((width - btn.width) / 2,
							 btn.y,
							 btn.width,
							 btn.height);

			context.font = (btn.height - 2 * btn.margin) + "px Arial"
			context.fillStyle = btn.fg_color;
			context.fillText(btn.content,
							 (width - btn.width) / 2 + btn.margin,
							 btn.y + btn.height - 2 *btn.margin);
		});
	}

	game.init = function() {
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

		if (!(canvas_x || canvas_y)) {
			canvas_x = canvas.getBoundingClientRect().x;
			canvas_y = canvas.getBoundingClientRect().y;
		}

		menu_btns.push({
			width: 120,
			height: 60,
			x: (width - 120) / 2,
			y: 190,
			margin: 10,
			bg_color: "#88472b",
			fg_color: "#0d0515",
			content: "Play",
			action: game.start
		});

		win_btns.push({
			width: 120,
			height: 60,
			x: (width - 120) / 2,
			y: 150,
			margin: 10,
			bg_color: "#88472b",
			fg_color: "#0d0515",
			content: "Menu",
			action: game.menu
		});

		win_btns.push({
			width: 120,
			height: 60,
			x: (width - 120) / 2,
			y: 220,
			margin: 10,
			bg_color: "#88472b",
			fg_color: "#0d0515",
			content: "Play",
			action: game.start
		});

		game.menu();
	}

	game.menu = function() {
		status = "menu";

		context.fillStyle = "#fef8cd";
		context.fillRect(0, 0, width, height);

		context.font = "60px Arial"
		context.fillStyle = "#0d0515";
		context.fillText("The 15 Game", 60, 120);

		draw_btns(menu_btns);
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

		context.font = font_size + "px Arial";
		context.lineWidth = side_border;

		status = "playing";
		scramble();
		game.draw();
	}

	game.input = function(event) {

		function get_cell_index(x, y) {
			var j = Math.floor((x - 1) / side_length);
			var i = Math.floor((y - 1) / side_length);
			return i * 4 + j;
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

		var mouse_x = event.clientX - canvas_x;
		var mouse_y = event.clientY - canvas_y;

		if (status === "menu") {
			menu_btns.forEach(function(b) {
				if (inside(mouse_x, mouse_y, b)) {
					b.action();
				}
			});
		} else if (status === "win") {
			win_btns.forEach(function(b) {
				if (inside(mouse_x, mouse_y, b)) {
					b.action();
				}
			});
		} else if (status === "playing") {
			var selected = get_cell_index(mouse_x, mouse_y);
			var empty = get_empty_cell();

			if (near(selected, empty)) {

				temp = board[selected];
				board[selected] = board[empty];
				board[empty] = temp;

				game.draw();

				if (win()) {
					status = "won";
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
		status = "win";

		context.fillStyle = "#fef8cd";
		context.fillRect(0, 0, width, height);

		context.font = "60px Arial"
		context.fillStyle = "#0d0515";
		context.fillText("Victory!", 60, 120);

		draw_btns(win_btns);
	}

}(Game))