export default {
    spritesheetPath: 'assets/dhonu.png',
    spriteSheetAnimations: [
        {
            key: 'left',
            frames: { start: 0, end: 6 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'right',
            frames: { start: 0, end: 6 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'idle',
            frames: { start: 7, end: 10 },
            frameRate: 3,
            repeat: -1
        }
    ],
    movementSpeed: 400,
    frameDimensions: {
        x: 206,
        y: 206
    },
    hitboxDimensions: {
        x: 118,
        y: 80
    },
    jumpHeights: {
        first: -700,
        second: -350
    },
    mass: 200
}