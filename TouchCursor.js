/* global Phaser */
/**
  * Phaser Touch Cursor Plugin
  * Adds native cursor movement for touch screen devices

	The MIT License (MIT)

	Copyright (c) 2014 Eugenio Fage
	Copyright (c) 2015 Nathan Bawden

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

	Original Contact: https://github.com/eugenioclrc, @eugenioclrc
	Contact: http://code.playnexus.com

  */

(function(Phaser) {
	//'use strict';
	/**
	  * TouchCursor Plugin for Phaser
	  */
	Phaser.Plugin.TouchCursor = function (game, parent, settings /*optional*/) {
		/* Extends the plugin */
		Phaser.Plugin.call(this, game, parent);
		this.input = this.game.input;
		
        // Load optional instance settings		
		if (settings) for (var n in settings) {
		    this.settings[n] = settings[n];
		}
		
		if (this.settings.touchImage) {
    		this.images = [];
    		this.images.push(this.game.add.sprite(0, 0, 'compass'));
    		this.images.push(this.game.add.sprite(0, 0, 'finger'));
    		this.images.push(this.game.add.sprite(0, 0, 'finger'));
    		this.images.push(this.game.add.sprite(0, 0, 'touched'));
    		this.images.forEach(function (e) {
    			e.anchor.set(0.5);
    			e.visible=false;
    			e.fixedToCamera=true;
    		});
		}
	};

	//Extends the Phaser.Plugin template, setting up values we need
	Phaser.Plugin.TouchCursor.prototype = Object.create(Phaser.Plugin.prototype);
	Phaser.Plugin.TouchCursor.prototype.constructor = Phaser.Plugin.TouchCursor;

    // Default settings
	Phaser.Plugin.TouchCursor.prototype.settings = {
		// max distance from itial touch
		maxDistanceInPixels: 200,
		singleDirection: false,
		touchImage: false
	};
	
	Phaser.Plugin.TouchCursor.prototype.cursors = {
		up: {isDown: false}, down: {isDown: false}, left: {isDown: false}, right: {isDown: false},
		speed: {x: 0, y: 0, xy: 0}
	};

	Phaser.Plugin.TouchCursor.prototype.inputEnable = function() {
		this.input.onDown.add(createCompass, this);
		this.input.onUp.add(removeCompass, this);
	};

	Phaser.Plugin.TouchCursor.prototype.inputDisable = function() {
		this.input.onDown.remove(createCompass, this);
		this.input.onUp.remove(removeCompass, this);
	};

	var initialPoint;

	var createCompass = function() {
	    if (this.settings.touchImage) {
    		this.images.forEach(function (e) {
    			e.visible=true;
    			e.bringToTop();
    			e.cameraOffset.x=this.input.worldX;
    			e.cameraOffset.y=this.input.worldY;
    		}, this);
	    }
		
		this.preUpdate = setDirection.bind(this);

		initialPoint = this.input.activePointer.position.clone();
		
	};

	var removeCompass = function () {
	    if (this.settings.touchImage) {
    		this.images.forEach(function(e){
    			e.visible = false;
    		});
	    }

		this.cursors.up.isDown = false;
		this.cursors.down.isDown = false;
		this.cursors.left.isDown = false;
		this.cursors.right.isDown = false;
		
		this.speed.x = 0;
		this.speed.y = 0;
		
		this.preUpdate = noop;
	};
	
	var noop = function() {};

	var setDirection = function() {
		var cc = this.cursors;
		var d = initialPoint.distance(this.input.activePointer.position);
		var maxDistanceInPixels = this.settings.maxDistanceInPixels;

		var deltaX = this.input.activePointer.position.x-initialPoint.x;
		var deltaY = this.input.activePointer.position.y-initialPoint.y;

		if(this.settings.singleDirection){
			if(Math.abs(deltaX) > Math.abs(deltaY)){
				deltaY = 0;
				this.input.activePointer.position.y=initialPoint.y;
			}else{
				deltaX = 0;
				this.input.activePointer.position.x=initialPoint.x;
			}
		}
		var angle = initialPoint.angle(this.input.activePointer.position);
		
		
		if(d > maxDistanceInPixels){
			deltaX = Math.cos(angle) * maxDistanceInPixels;
			deltaY = Math.sin(angle) * maxDistanceInPixels;
		}

		cc.speed.x = parseInt((deltaX/maxDistanceInPixels) * 100 * -1, 10);
		cc.speed.y = parseInt((deltaY/maxDistanceInPixels) * 100 * -1, 10);
		cc.speed.xa = Math.abs(cc.speed.x);
		cc.speed.ya = Math.abs(cc.speed.y);
		cc.speed.top = Math.max(cc.speed.xa, cc.speed.ya);

		var mdd = 12;
		this.cursors.up.isDown = (deltaY < 0) && cc.speed.ya > mdd;
		this.cursors.down.isDown = (deltaY > 0) && cc.speed.ya > mdd;
		this.cursors.left.isDown = (deltaX < 0) && cc.speed.xa > mdd;
		this.cursors.right.isDown = (deltaX > 0) && cc.speed.xa > mdd;

        if (this.settings.touchImage) {		
    		this.images.forEach(function(e,i){
    			e.cameraOffset.x = initialPoint.x+(deltaX)*i/3;
    			e.cameraOffset.y = initialPoint.y+(deltaY)*i/3;
    		}, this);
        }
	};
	
	Phaser.Plugin.TouchCursor.prototype.preUpdate = noop;
	
}(Phaser));
