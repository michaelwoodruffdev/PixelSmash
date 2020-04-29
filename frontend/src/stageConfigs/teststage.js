export default {
    assets: {
        background: 'assets/background.png', 
        ground: 'assets/ground.png'
    }, 
    passablePlatforms: [
        {
            x: 100, 
            y: 350, 
            scale: 1.2
        }, 
        {
            x: 1100, 
            y: 350, 
            scale: 1.2
        }, 
        {
            x: 600, 
            y: 300, 
            scale: 1.2
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