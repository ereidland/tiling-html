$(function()
{
	var map			= $("#map"),
		size		= 10,
		tileSize	= 40,
		mapLeft		= map.offset().left,
		mapTop		= map.offset().top,
		fadeTime	= 500,
		screen		= {x: 0, y: 0},
		nextShift	= 0;

	function createMapTile(x, y)
	{
		map.append(
					$("<div id=\"" + x + "_" + y + "\">")
						.addClass("maptile")
						.css(
						{
							"left": mapLeft + (x - screen.x)*tileSize + "px",
							"top": mapTop + (y - screen.y)*tileSize + "px",
							"width": tileSize + "px",
							"height": tileSize + "px",
							"opacity": 0
						})
						.text(x + ", " + y)
						.data("screenPos", { x: x - screen.x, y: y - screen.y })
				);
	}

	function shiftMap(x, y)
	{
		if (Date.now() > nextShift)
		{
			nextShift = Date.now() + fadeTime;
		}
		else
			return;

		for (var ix = 0; ix < Math.abs(x); ix++)
		{
			for (var iy = 0; iy < size; iy++)
			{
				createMapTile(screen.x + ix + (x < 0 ? size : -x), screen.y + iy);
			}
		}
		for (var iy = 0; iy < Math.abs(y); iy++)
		{
			for (var ix = 0; ix < size; ix++)
			{
				createMapTile(screen.x + ix, screen.y + iy + (y < 0 ? size : -y));
			}
		}
		screen.x -= x;
		screen.y -= y;
		$.each(map.children(), function(i, elem)
		{
			elem = $(elem);
			var pos = elem.offset();
			var screenPos = elem.data("screenPos");

			screenPos.x += x;
			screenPos.y += y;

			var dying =
					  (screenPos.x < 0
					|| screenPos.x >= size
					|| screenPos.y < 0
					|| screenPos.y >= size);

			var toanim =
			{
				"left": "+=" + x*tileSize + "px",
				"top": "+=" + y*tileSize + "px",
				"opacity": dying ? 0 : 1
			};	

			elem.animate(toanim, fadeTime, function()
			{
				if (dying)
					this.remove();
			});
		});
	}

	$("body").keypress(function(event)
	{
		console.log("Key: " + event.which);
		switch(event.which)
		{
			case 119: //w
				shiftMap(0, 1);
				break;
			case 115: //s
				shiftMap(0, -1);
				break;
			case 97: //a
				shiftMap(1, 0);
				break;
			case 100: //d
				shiftMap(-1, 0);
				break;
			default:
				break;
		}
	});

	for (var x = 0; x < size; x++)
	{
		for (var y = 0; y < size; y++)
		{
			createMapTile(x, y);
		}
	}
	shiftMap(0, 0); //Created blocks are faded out. Shifting the map animates opacity.
});