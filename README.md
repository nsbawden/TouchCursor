## TouchCursor

### Phaser plugin adds native cursor movement for touch screen devices

Example plugin setup inside your create() function

        // Load the keyboard and touch cursors
        game.touchCursor = game.plugins.add(Phaser.Plugin.TouchCursor);
        this.cursors = game.touchCursor.createCursorKeys({
            both: true
        });

Example of using the cursors in your update() funciton

        var cc = this.cursors;
        this.logo.body.velocity.y = cc.up.isDown ? -200 : (cc.down.isDown ? 200 : 0);
        this.logo.body.velocity.x = cc.left.isDown ? -200 : (cc.right.isDown ? 200 : 0);

Default settings can be changed by adding to the creatCursorKeys() options list

        // Default settings
        Phaser.Plugin.TouchCursor.prototype.settings = {
            maxDistance: 200, // max distance from initial touch
            triggerSpeed: 12, // minimum speed to trigger key down
            lockAxis: false, // lock to x and y axis - no diagonal
            both: false, // combine keyboard and touch/mouse input
            autodetect: false, // autodetect keyboard or touch
            touchImage: false // display images at touch points
        };

        Example:
        
        this.cursors = game.touchCursor.createCursorKeys({
            both: true,         // both keyboard and touch
            lockAxis: true,     // single key input (no diagonal)
            triggerSpeed: 20    // Long swipe required to activate key
        });

For special applications images can be shown at both ends and along the swipe during the touch stroke. This adds visual feedback but can also slow down input response, especailly on mobile devices. To add image support supply the touchImage: true option and add the following code to the preload() function to load the images. The images must be in the respective project folder for loading.

        preload: function () {
        // Load part of the jsfiddle logo image as a sprite
            game.load.image('touchcursor_compass', 'compass.png');
            game.load.image('touchcursor_finger', 'finger.png');
            game.load.image('touchcursor_touched', 'touched.png');
        },

