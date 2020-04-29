export default {
    spritesheetPath: 'assets/billnbob.png',
    spriteSheetAnimations: [
        {
            key: 'left',
            frames: { start: 5, end: 8 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'right',
            frames: { start: 5, end: 8 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'idle',
            frames: { start: 4, end: 8 },
            frameRate: 4,
            repeat: -1
        },
        {
            key: 'firstjump',
            frames: { start: 9, end: 15 },
            frameRate: 15,
            repeat: -1
        }, 
        {
            key: 'secondjump',
            frames: { start: 9, end: 15 },
            frameRate: 15,
            repeat: -1
        }, 
        {
            key: 'falling',
            frames: { start: 9, end: 15 },
            frameRate: 15,
            repeat: -1
        }, 
        {
            key: 'jab', 
            frames: { start: 9, end: 15}, 
            frameRate: 20, 
            repeat: 0
        }, 
        {
            key: 'aerial-attack', 
            frames: { start: 9, end: 15 }, 
            frameRate: 20, 
            repeat: 0
        }
    ], 
    fighterKey: 'billnbob', 
    movementSpeed: 400,
    frameDimensions: {
        frameWidth: 192,
        frameHeight: 192
    },
    hitboxDimensions: {
        x: 80,
        y: 95
    },
    jumpHeights: {
        first: -550,
        second: -550
    },
    mass: 200,
    scale: .6
}