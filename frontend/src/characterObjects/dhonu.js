export default {
    spritesheetPath: 'assets/dhonu2-3.png',
    spriteSheetAnimations: [
        {
            key: 'left',
            frames: { start: 1, end: 5 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'right',
            frames: { start: 1, end: 5 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'firstjump',
            frames: { start: 6, end: 7 },
            frameRate: 10,
            repeat: 0
        },
        {
            key: 'falling',
            frames: { start: 8, end: 11 },
            frameRate: 14,
            repeat: 0
        },
        {
            key: 'secondjump',
            frames: { start: 14, end: 17 },
            frameRate: 15,
            repeat: -1
        },
        {
            key: 'landing-frame',
            frames: { start: 18, end: 18 },
            frameRate: 12,
            repeat: -1
        },
        {
            key: 'ledge-hang',
            frames: { start: 19, end: 22 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'idle',
            frames: { start: 23, end: 26 },
            frameRate: 5,
            repeat: -1
        }
    ],
    fighterKey: 'dhonu', 
    movementSpeed: 400,
    frameDimensions: {
        frameWidth: 1280,
        frameHeight: 1280
    },
    hitboxDimensions: {
        x: 400,
        y: 500
    },
    jumpHeights: {
        first: -900,
        second: -600
    },
    mass: 200, 
    scale: .2
}
