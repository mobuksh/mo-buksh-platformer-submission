var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();
// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var METER = TILE;

var GRAVITY = METER * 6.3 * 3;

var MAXDX = METER * 10;
var MAXDY = METER * 15;

var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;

var JUMP = METER * 1500;

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var enemies = [];

var LAYER_COUNT = 3;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;
var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;

//collision array
var cells = [];
function initialise()
{
	for (var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)
	{
		// create environment tiles
		cells[layerIdx] = [];
		var idx = 0;
		for (var y = 0; y < level.layers[layerIdx].height; y++)
		{
			cells[layerIdx][y] = [];
			for (var x = 0; x < level.layers[layerIdx].width; x++)
			{
				if (level.layers[layerIdx].data[idx] != 0)
				{
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y][x+1] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
				}
				else if (cells[layerIdx][y][x] != 1)
				{
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}

		//create enemies
		idx = 0;
		for(var y = 0; y < level.layers[LAYER_OBJECT_ENEMIES].height; y++)
		{
			for(var x = 0; x < level.layers[LAYER_OBJECT_ENEMIES].width; x++)
			{
				if(level.layers[LAYER_OBJECT_ENEMIES].data[idx] !=0)
				{
					var px = tileToPixel(x);
					var py = tileToPixel(y);
					var e = new Enemy(px, py);
					enemies.push(e);
				}
				idx++;
			}
		}
	}
}

initialise();
var player = new Player();
var keyboard = new Keyboard();

var music = new Howl(
{
	urls: ["audio/background.ogg"],
	loop: true,
	buffer: true,
	volume: 0.5
});
//UNCOMMENT FOR MUSIC
//music.play();
var cam_x = 0;
var cam_y = 0;

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	player.update(deltaTime);
	
	cam_x = bound(player.x - canvas.width / 2, 0, MAP.tw * TILE);
	cam_y = bound(player.y - canvas.height / 2, 0, canvas.height);
	
	drawMap(cam_x, cam_y);
	player.draw(cam_x, cam_y);

	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
	}
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].draw(deltaTime);
	}
		
		// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	//context.fillStyle = "#f00";
	//context.font="14px Arial";
	//context.fillText("FPS: " + fps, 5, 20, 100);
}


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);