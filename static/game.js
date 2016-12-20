/**
 * Created by gus on 12/24/15.
 * TODO OO refactor
 */
var canvas,
	ctx,
	cacheCanvas,
	cacheCtx,
    windowX = 0,
    windowY = 0,
    windowWidth = 32,
    windowHeight = 32,
    pixelData = {},
    needsUpdate = true,
    lastMouseLocation = '';

if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	});
}

function main() {
	canvas = document.querySelector('canvas');
	canvas.width = 480;
	canvas.height = 480;

	ctx = canvas.getContext('2d')
	cacheCanvas = document.createElement('canvas');
    cacheCanvas.width = canvas.width;
    cacheCanvas.height = canvas.height;
	cacheCtx = cacheCanvas.getContext('2d');

	gameLoop();
}

function gameLoop() {
	update();
	draw();
	window.requestAnimationFrame(gameLoop);
}

function update() {
    //TODO pixels changed update
    if (needsUpdate) {
        needsUpdate = false;
        //start with minimum and maximum values
        var minx = windowX + windowWidth + 5,
            maxx = windowX - 5,
            miny = windowY + windowHeight + 5,
            maxy = windowHeight - 5
        var needsJSON = false;
        for (x = windowX - 5; x < windowX + windowWidth + 5; x++) {
            for (y = windowY - 5; y < windowY + windowHeight + 5; y++) {
                if (!(String(x + ',' + y) in pixelData)) {
                    pixelData[String(x + ',' + y)] = new Pixel(x, y, 0);
                    if (x > maxx) { maxx = x }
                    if (x < minx) { minx = x }
                    if (y > maxy) { maxy = y }
                    if (y < miny) { miny = y }
                    needsJSON = true;
                }
            }
        }
        // update with GET request from server using JQuery's getJSON
        if (needsJSON) {
            $.getJSON("../pixels/" + minx + "," + miny + ":" + (maxx - minx + 1) + "," + (maxy - miny + 1), function (data) {
                $.each(data['pixels'], function (index, pixel) {
                    pixelData[String(pixel.x + ',' + pixel.y)] = new Pixel(pixel.x, pixel.y, pixel.color);
                });
            });
        }
    }
}

function draw() {
	cacheCtx.clearRect(0, 0, canvas.width, canvas.height);
    for (x = windowX; x < windowX + windowWidth; x++) {
        for (y = windowY; y < windowY + windowHeight; y++) {
            (pixelData[String(x + ',' + y)]).draw();
        }
    }
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(cacheCanvas, 0, 0);
}

$('#canvas').on('touchstart mousedown mousemove', function(event) {
    canvasCoords = getElementClickXY(canvas, event)
    var wallX = Math.floor(canvasCoords.x / (canvas.width / windowWidth)) + windowX,
        wallY = Math.floor(canvasCoords.y / (canvas.height / windowHeight)) + windowY,
        coords = String(wallX + ',' + wallY);
    if (!(event.type == 'mousemove' && lastMouseLocation == coords)) {
        if (event.buttons == 1) {
            //TODO multiple colors
            //TODO limited ink
            pixelData[coords].color = 1 - pixelData[coords].color;
            $.ajax({
                url: '../pixels',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({pixels: [pixelData[coords]]}),
                dataType: 'json'
            });
        } else if (event.button == 2) {
        } else if (event.button == 4) {
        }
    }
    lastMouseLocation = coords
    event.preventDefault();
});

//TODO listen for color selection
//TODO listen for zoom in/out

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
            windowX--;
            break;

        case 38: // up
            windowY--;
            break;

        case 39: // right
            windowX++;
            break;

        case 40: // down
            windowY++;
            break;

        default: return; // exit this handler for other keys
    }
    needsUpdate = true;
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

function getElementClickXY(element, event) {
    var x;
    var y;
    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    }
    else {
      x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= element.offsetLeft;
    y -= element.offsetTop;
    return {'x':x,'y':y}
}

function Pixel(x, y, color) {
	this.x = x;
    this.y = y;
    if (color == null) {
        this.color = Math.floor(Math.random() * 2);
    } else {
        this.color = color;
    }
}

Pixel.prototype.draw = function() {
    if (this.x >= windowX &&
            this.x < windowX + windowWidth &&
            this.y >= windowY &&
            this.y < windowY + windowHeight) {
        //TODO multiple colors
        if (this.color == 1) {
            cacheCtx.fillStyle = "rgb(0,0,0)";
        } else {
            cacheCtx.fillStyle = "rgb(256,256,256)";
        }
        cacheCtx.fillRect((canvas.width / windowWidth) * (x - windowX),
            (canvas.height / windowHeight) * (y - windowY),
            (canvas.width / windowWidth),
            (canvas.height / windowHeight));
    }
}
