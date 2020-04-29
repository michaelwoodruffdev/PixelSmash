export default {
    assets: {
        background: 'assets/Background_sprite_1.png', 
        ground: 'assets/solid-stage-cropped.png', 
        passablePlatform: 'assets/fallthrough.png'
    }, 
    passablePlatforms: [
        {
            x: 100, 
            y: 250, 
            scale: .35
        }, 
        {
            x: 1100, 
            y: 250, 
            scale: .35
        }, 
        {
            x: 600, 
            y: 200, 
            scale: .35
        }
    ], 
    impassablePlatforms: [
        {
            x: 600, 
            y: 550, 
            scale: .6
        }
    ],
    spawnLocations: [
        {
            x: 600, 
            y: 300
        }, 
        {
            x: 900, 
            y: 300
        }
    ]
}