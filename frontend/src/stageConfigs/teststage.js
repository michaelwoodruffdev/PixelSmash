export default {
    assets: {
        background: 'assets/background.png', 
        ground: 'assets/ground.png'
    }, 
    passablePlatforms: [
        {
            x: 250, 
            y: 400, 
            scale: .2
        }, 
        {
            x: 950, 
            y: 400, 
            scale: .2
        }
    ], 
    impassablePlatforms: [
        {
            x: 600, 
            y: 550, 
            scale: 1.1
        }
    ],
    spawnLocations: [
        {
            x: 600, 
            y: 400
        }, 
        {
            x: 900, 
            y: 400
        }
    ]
}