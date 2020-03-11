export default {
    spritesheetPath: 'assets/trumpsprite.png',
    spriteSheetAnimations: [
        {
            key: 'left',
            frames: { start: 18, end: 23 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'right',
            frames: { start: 6, end: 1 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'firstjump', 
            frames: { start: 2, end: 10 }, 
            frameRate: 30, 
            repeat: -1
        }, 
        {
            key: 'secondjump', 
            frames: { start: 2, end: 10 }, 
            frameRate: 30, 
            repeat: -1
        }, 
        {
            key: 'falling', 
            frames: { start: 2, end: 10 }, 
            frameRate: 30, 
            repeat: -1
        }, 
        {
            key: 'idle',
            frames: { start: 4, end: 5 },
            frameRate: 3,
            repeat: -1
        }
    ],
    fighterKey: 'troomp', 
    movementSpeed: 400,
    frameDimensions: {
        frameWidth: 100,
        frameHeight: 100
    },
    hitboxDimensions: {
        x: 30,
        y: 70
    },
    jumpHeights: {
        first: 80,
        second: 40
    },
    mass: 200, 
    scale: 2
}