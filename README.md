## TouchCursor

Phaser plugin adds native cursor movement for touch screen devices

    // Default settings
    Phaser.Plugin.TouchCursor.prototype.settings = {
        maxDistance: 200, // max distance from initial touch
        triggerSpeed: 12, // minimum speed to trigger key down
        lockAxis: false, // lock to x and y axis - no diagonal
        both: false, // combine keyboard and touch/mouse input
        autodetect: false, // autodetect keyboard or touch
        touchImage: false // display images at touch points
    };

