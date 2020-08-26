(main = () => {
    //  Draw grid layout
    const drawGrid = (canvas, ctx) => {
        let w = canvas.width,
            h = canvas.height,
            dx = 15,
            dy = 15,
            x = 0,
            y = 0

        // Move cursor and draw line
        const drawGridTo = (ctx, mx, my, from, to) => {
            ctx.moveTo(mx + .5, my + .5)
            ctx.lineTo(from + .5, to + .5)
            ctx.stroke()
        }

        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = '#e4e4e4'
        
        while (y < h - dy) {
            y = y + dy
            drawGridTo(ctx, x, y, w, y)
        }

        y = 0

        while(x < w - dx) {
            x = x + dx
            drawGridTo(ctx, x, y, x ,h)
        }
        ctx.closePath()
    }

    //  Draw X and Y lines coordinate
    const drawCoordinates = (canvas, ctx) => {
        let w = canvas.width,
            h = canvas.height

        //  Draw one coordinate line
        const drawLine = (ctx, mx, my, x, y) => {
            ctx.moveTo(mx, my)
            ctx.lineTo(x, y)
            ctx.stroke()
        }

        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = '#404040'

        drawLine(ctx, 0, h, w, h)
        drawLine(ctx, 0, 0, 0, h)
        
        ctx.closePath()
    }

    let points = []
    let pointsCount = 10

    //  Generate new points array
    const pointGenerate = (canvas, count) => {
        points = []
        let w = canvas.width,
            h = canvas.height

        const share = w / count

        for(let i = 1; i <= count; i++) {
            let x = Math.round(Math.round((share * i) - 0.5 + Math.random() * ((share * i) - (share * i) - share + 1))),
                y = Math.round(Math.random() * h)

            points.push({
                "x": x,
                "y": y
            })
        }
    }

    //  Checking equality of two arrays
    const isEqualArrays = (first, second, count) => {
        for(let i = 0; i < count; i++) {
            let fx = first[i]['x'],
                fy = first[i]['y'],
                sx = second[i]['x'],
                sy = second[i]['y']
            
            fx = fx.toFixed()
            fy = fy.toFixed()

            if(fx < sx && fy < sy) return false
        }
        
        return true
    }
    
    //  Initialize points drawing or when coordinates change 
    const pointDraw = (ctx, current, points, count) => {
        //  Animate points function when it changes
        const animate = (arr, points, count) => {
            for(let i = 0; i < count; i++) {
                let startX = arr[i]['x'],
                    startY = arr[i]['y'],
                    endX = points[i]['x'],
                    endY = points[i]['y']

                let distanceX = endX - startX,
                    distanceY = endY - startY

                let x = startX + distanceX * count / 100,
                    y = startY + distanceY * count / 100;

                arr[i]['x'] = x
                arr[i]['y'] = y

                draw(arr, count)
            }

            if(!isEqualArrays(arr, points, count)) requestAnimationFrame((time) => animate(arr, points, count))
            else enableRebuildButton()
        }

        //  Draw points function
        const draw = (arr, count) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            initialLayout()
            
            for(let i = 0; i < count; i++) {
                const x = arr[i]['x'],
                      y = arr[i]['y']
    
                if(i != 0) {
                    ctx.beginPath()
                    ctx.moveTo(arr[i - 1]['x'], arr[i - 1]['y'])
                    ctx.lineTo(x, y)
                    ctx.strokeStyle = '#404040'
                    ctx.stroke()
                    ctx.closePath()
                }
            }
    
            for(let i = 0; i < count; i++) {
                const x = arr[i]['x'],
                      y = arr[i]['y']
                
                ctx.beginPath()
                ctx.arc(x, y, 4, 0, Math.PI * 2)
                ctx.strokeStyle = '#fd553e'
                ctx.fillStyle = '#fd553e'
                ctx.fill()
                ctx.stroke()
                ctx.closePath()
            }
        }

        let arr = current != null ? current : points
        
        if(current != null) {
            disableRebuildButton()
            requestAnimationFrame((time) => animate(arr, points, count))
        }
        else draw(arr, count)
    }

    // --------------- START POINT ---------------------
        
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const initialRect = () => {
        pointGenerate(canvas, pointsCount)
        pointDraw(ctx, null, points, pointsCount)
    }

    const initialLayout = () => {
        drawGrid(canvas, ctx)
        drawCoordinates(canvas, ctx)
    }

    const rebuildCoordinates = () => {
        let current = points

        pointGenerate(canvas, pointsCount)
        pointDraw(ctx, current, points, pointsCount)
    }

    const rebuildBtn = document.querySelector('button')

    const disableRebuildButton = () => rebuildBtn.disabled = true
    const enableRebuildButton = () => rebuildBtn.disabled = false

    document.addEventListener('DOMContentLoaded', () => {
        initialRect()
    })

    canvas.addEventListener('mouseup', () => {
        rebuildCoordinates()
    })

    document.querySelector('button').addEventListener('click', () => {
        rebuildCoordinates()
    })
})()