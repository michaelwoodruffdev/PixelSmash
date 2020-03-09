export default {
    assets: {
        background: 'assets/background.png', 
        ground: 'assets/ground.png'
    }, 
    passablePlatforms: [
        {
            x: 100, 
            y: 250, 
            scale: .2
        }, 
        {
            x: 1100, 
            y: 250, 
            scale: .2
        }, 
        {
            x: 600, 
            y: 200, 
            scale: .3
        }
    ], 
    impassablePlatforms: [
        {
            x: 600, 
            y: 450, 
            scale: 1.3
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