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
            frames: { start: 0, end: 8 },
            frameRate: 7,
            repeat: -1
        },
        {
            key: 'jump',
            frames: { start: 9, end: 15 },
            frameRate: 15,
            repeat: -1
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
        first: -450,
        second: -550
    },
    mass: 200,
    scale: .6
}