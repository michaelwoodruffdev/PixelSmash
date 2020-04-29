export default {
    spritesheetPath: 'assets/DhonuKingOfTheForest.png',
    spriteSheetAnimations: [
        {
            key: 'right',
            frames: { start: 0, end: 5 },
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'left',
            frames: { start: 0, end: 5 },
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
            frameRate: 7,
            repeat: 0
        }, 
        {
            key: 'aerial-attack',
            frames: { start: 12,end: 15},
            frameRate: 10,
            repeat: -1
        },
        {
            key: 'secondjump',
            frames: { start: 16, end: 21 },
            frameRate: 15,
            repeat: -1
        },
        // {
        //     key:'landing-frame',
        //     frames: {start:22, end:22},
        //     frameRate: 12,
        //     repeat: -1
        // },
        // {
        //     key:'ledge-hang',
        //     frames: {start:23, end:26},
        //     frameRate: 10,
        //     repeat: -1
        // },
        // {
        //     key:'ledge-getup-start',
        //     frames: {start:27,end:30},
        //     framerate: 10,
        //     repeat: -1
        // },
        // {
        //     key:'ledge-getup-attack',
        //     frames:{start:31,end:34},
        //     framerate: 10,
        //     repeat: -1
        // },
        {
            key:'idle',
            frames: {start:35, end: 38},
            frameRate: 6,
            repeat: -1
        },
        {
            key:'jab',
            frames:{start:39,end:44},
            frameRate: 10,
            repeat: -1
        },
        {
            key:'side-tilt',
            frames:{start:45,end: 48},
            framerate: 10,
            repeat: -1
        }
    ],
    fighterKey: 'dhonu_gold', 
    movementSpeed: 400,
    frameDimensions: {
        frameWidth: 2000,
        frameHeight: 2000
    },
    hitboxDimensions: {
        x: 400,
        y: 500
    },
    jumpHeights: {
        first: -600,
        second: -600
    },
    mass: 200, 
    scale: .2
}