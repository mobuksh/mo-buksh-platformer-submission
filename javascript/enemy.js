var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_SHOOT_LEFT = 6;
var ANIM_SHOOT_RIGHT = 7;
var ANIM_MAX = 8;

var Enemy = function(x, y) {
	// delete me
	//this.image = document.createElement("img");
	//this.image.src = "hero.png";   

	this.sprite = new Sprite("images/enemies.png");
	
	//enemy bite
	this.sprite.buildAnimation(2, 1, 51, 58, 0.05,
							[0,1]);

	this.sprite.setAnimationOffset(0, -35, 40);

	this.position = new Vector2();
	this.position.set(x,y);
	this.velocity = new Vector2();
	this.moveRight = true;
	this.pause = 0;

	////////////////////////////////////
	var self = this;
	this.die_sfx_isPlaying = false;
	this.die_sfx = new Howl(
	{
		urls : ["audio/fireEffect.ogg"],
		buffer : true,
		volume : 1,
		onend: function() {
			self.die_sfx_isPlaying = false;
		}
	});
	////////////////////////////////////////
};

Enemy.prototype.update = function(deltaTime)
{	
	this.sprite.update(deltaTime);

	if(this.pause > 0)
	{
		this.pause -= deltaTime;
	}
	else
	{
		var ddx= 0; // acceleration speed

		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE; // True if the enemy overlaps right (? wat)
		var ny = (this.position.y)%TILE; // True if the enemy overlaps below (? wat)

		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty+1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty+1);

		if(this.moveRight)
		{
			if(celldiag && !cellright)
			{
				ddx = ddx + ENEMY_ACCEL; // enemy wants to go right: ENEMY_ACCEL declared in main.js
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = false
				this.pause = 0.5;
			}
		}

		if(!this.moveRight)
		{
			if(celldown && !cell)
			{
				ddx = ddx - ENEMY_ACCEL; // enemy wants to go left: ENEMY_ACCEL declared in main.js
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = true;
				this.pause = 0.5;
			}
		}

		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -ENEMY_MAXDX, ENEMY_MAXDX);




	}





	//var left = false;
	//var right = false;
	//var jump = false;
	//
	//if (keyboard.isKeyDown(keyboard.KEY_LEFT))
	//{
	//	left = true;
	//	this.direction = LEFT;
	//	if (this.sprite.currentAnimation != ANIM_WALK_LEFT
	//		&& this.sprite.currentAnimation != ANIM_SHOOT_LEFT
	//		&& !this.jumping)
	//		this.sprite.setAnimation(ANIM_WALK_LEFT);
	//}
	//else if (keyboard.isKeyDown(keyboard.KEY_RIGHT))
	//{
	//	right = true;
	//	this.direction = RIGHT;
	//	if (this.sprite.currentAnimation != ANIM_WALK_RIGHT
	//		&& this.sprite.currentAnimation != ANIM_SHOOT_RIGHT
	//		&& !this.jumping)
	//		this.sprite.setAnimation(ANIM_WALK_RIGHT);
	//}
	//else
	//{
	//	if (!this.jumping && !this.falling && !this.shooting)
	//	{
	//		if (this.direction == LEFT)
	//		{
	//			if (this.sprite.currentAnimation != ANIM_IDLE_LEFT)
	//				this.sprite.setAnimation(ANIM_IDLE_LEFT);
	//		}
	//		else
	//		{
	//			if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
	//				this.sprite.setAnimation(ANIM_IDLE_RIGHT);
	//		}
	//	}
	//}
	//
	//if (keyboard.isKeyDown(keyboard.KEY_SPACE))
	//{
	//	jump = true;
	//	if (left)
	//		this.sprite.setAnimation(ANIM_JUMP_LEFT);
	//
	//	if (right)
	//		this.sprite.setAnimation(ANIM_JUMP_RIGHT);
	//
    //
	//}
	//
	//if (keyboard.isKeyDown(keyboard.KEY_SHIFT) && !jump)
	//{
	//	this.shooting = true;
	//	if (this.direction == LEFT)
	//	{
	//		if (this.sprite.currentAnimation != ANIM_SHOOT_LEFT )
	//			this.sprite.setAnimation(ANIM_SHOOT_LEFT);
	//	}
	//	else
	//	{
	//		if (this.sprite.currentAnimation != ANIM_SHOOT_RIGHT)
	//			this.sprite.setAnimation(ANIM_SHOOT_RIGHT);
	//	}
	//}
	//else if (this.shooting)
	//	this.shooting = false;
	//
	//
	//var wasleft = (this.velocity_x < 0);
	//var wasright = (this.velocity_x > 0);
	//var falling = this.falling;
	//
	//var ddx = 0;
	//var ddy = GRAVITY;
	//
	//if (left)
	//	ddx = ddx - ACCEL;
	//else if (wasleft)
	//	ddx = ddx + FRICTION;
	//
	//if (right)
	//	ddx = ddx + ACCEL;
	//else if (wasright)
	//	ddx = ddx - FRICTION;
	//
	//if (jump && !this.jumping && !falling)
	//{
	//	ddy = ddy - JUMP;
	//	this.jumping = true;
	//	if (this.direction == LEFT)
	//		this.sprite.setAnimation(ANIM_JUMP_LEFT);
	//	else
	//		this.sprite.setAnimation(ANIM_JUMP_RIGHT);
	//
	//	if (!this.jump_sfx_isPlaying)
	//	{
	//		this.jump_sfx.play();
	//		this.jump_sfx_isPlaying = true;
	//	}
	//
	//}
	//
	//this.x = Math.floor( this.x + (deltaTime * this.velocity_x));
	//this.y = Math.floor( this.y + (deltaTime * this.velocity_y));
	//
	//this.velocity_x = bound(this.velocity_x + (deltaTime * ddx), -MAXDX, MAXDX);
	//this.velocity_y = bound(this.velocity_y + (deltaTime * ddy), -MAXDY, MAXDY);
	//
	//if ((wasleft && (this.velocity_x > 0)) ||
	//	(wasright && (this.velocity_x < 0)))
	//{
	//	this.velocity_x = 0;
	//}
	//
	//var tx = pixelToTile(this.x);
	//var ty = pixelToTile(this.y);
	//var nx = (this.x) % TILE;
	//var ny = (this.y) % TILE;
	//
	//var cell = 		cellAtTileCoord(LAYER_PLATFORMS, tx,	 ty);
	//var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	//var celldown =  cellAtTileCoord(LAYER_PLATFORMS, tx,	 ty + 1);
	//var celldiag =  cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
    //
	////downward
	//if (this.velocity_y > 0)
	//{
	//	if ((celldown && !cell) || (celldiag && !cellright && nx))
	//	{
	//		this.y = tileToPixel(ty);
	//		this.velocity_y = 0;
	//		this.falling = false;
	//		this.jumping = false;
	//		ny = 0;
	//	}
	//}
	////upwards
	//else if (this.velocity_y < 0)
	//{
	//	if ((cell && !celldown) || (cellright && !celldiag && nx))
	//	{
	//		this.y = tileToPixel(ty + 1);
	//		this.velocity_y = 0;
	//		cell = celldown;
	//		cellright = celldiag;
	//		ny = 0;
	//	}
	//}
	//
	////right
	//if (this.velocity_x > 0)
	//{
	//	if ((cellright && !cell) || (celldiag && !celldown && ny))
	//	{
	//		this.x = tileToPixel(tx);
	//		this.velocity_x = 0;
	//	}
	//}
	////left
	//else if (this.velocity_x < 0)
	//{
	//	if ((cell && !cellright) || (celldown && !celldiag && ny))
	//	{
	//		this.x = tileToPixel(tx + 1);
	//		this.velocity_x = 0;
	//	}
	//}
	//
	//if (this.y > canvas.height	+ 300)
	//{
	//	this.lives --;
	//	this.x = this.start_x;
	//	this.y = this.start_y;
	//}
}

Enemy.prototype.draw = function(cam_x, cam_y)
{
	this.sprite.draw(context, this.x - cam_x, this.y - cam_y);
		
	for (var i = 0; i < this.lives; i++)
	{
		context.save();
			context.translate(50 + ( 5 + this.lives_image.width) * i, 40);
			context.drawImage(this.lives_image,
				-this.lives_image.width/2, -this.lives_image.height/2,
				this.lives_image.width, this.lives_image.height);
		context.restore();
	}
}








