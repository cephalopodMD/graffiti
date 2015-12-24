/**
 * Created by gus on 12/24/15.
 */
var canvas,
	ctx,
	cacheCanvas,
	cacheCtx,
    windowX = 0,
    windowY = 0,
    windowWidth = 50,
    windowHeight = 50,
    pixelData = {},
    needsUpdate = true;

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
	canvas.width = 500;
	canvas.height = 500;

	ctx = canvas.getContext('2d');
	cacheCanvas = document.createElement('canvas');
    cacheCanvas.width = canvas.width;
    cacheCanvas.height = canvas.height;
	cacheCtx = cacheCanvas.getContext('2d');

    canvas.addEventListener('click', function (event) {
        var clickX = event.clientX - (canvas.offsetLeft),
            clickY = event.clientY - (canvas.offsetTop + canvas.getBoundingClientRect().top);
        clickEvent(event, clickX, clickY);
    }, false);

	gameLoop();
}

function clickEvent(event, x, y) {
    var wallX = Math.floor(x / (canvas.width / windowWidth)) + windowX,
        wallY = Math.floor(y / (canvas.height / windowHeight)) + windowY,
        coords = String(wallX + ',' + wallY);
    if (event.button == 0) {
        pixelData[coords].color = 1 - pixelData[coords].color;
    } else if (event.button == 1) {
    } else if (event.button == 2) {
    }
    //TODO send update to server using JSON
    needsUpdate = true;
}

function gameLoop() {
	update();
	draw();
	window.requestAnimationFrame(gameLoop);
}

function update() {
    if (needsUpdate) {
        //get unseen pixels
        for (x = windowX; x < windowX + windowWidth; x++) {
            for (y = windowY; y < windowY + windowHeight; y++) {
                if (!(String(x + ',' + y) in pixelData)) {
                    //TODO replace with GET request from server using JQuery's getJSON
                    pixelData[String(x + ',' + y)] = new Pixel(x, y);
                }
            }
        }
        needsUpdate = false;
    }
}

function draw() {
	cacheCtx.clearRect(0, 0, canvas.width, canvas.height);
    for (x = windowX; x < windowX + windowWidth; x++) {
        for (y = windowY; y < windowY + windowHeight; y++) {
            pixelData[String(x + ',' + y)].draw();
        }
    }
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(cacheCanvas, 0, 0);
}

function Pixel(x, y, color) {
	this.x = x;
    this.y = y;
    this.color = color;
}

function Pixel(x, y) {
	this.x = x;
    this.y = y;
    this.color = Math.floor(Math.random() * 2);
}

Pixel.prototype.draw = function() {
    if (this.x >= windowX &&
            this.x < windowX + windowWidth &&
            this.y >= windowY &&
            this.y < windowY + windowHeight) {
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