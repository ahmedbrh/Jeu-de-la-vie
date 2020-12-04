const seed = [
  [1, 5],
  [1, 6],
  [2, 5],
  [2, 6],
  [11, 5],
  [11, 6],
  [11, 7],
  [12, 4],
  [12, 8],
  [13, 3],
  [13, 9],
  [14, 3],
  [14, 9],
  [15, 6],
  [16, 4],
  [16, 8],
  [17, 5],
  [17, 6],
  [17, 7],
  [18, 6],
  [21, 3],
  [21, 4],
  [21, 5],
  [22, 3],
  [22, 4],
  [22, 5],
  [23, 2],
  [23, 6],
  [25, 1],
  [25, 2],
  [25, 6],
  [25, 7],
  [35, 3],
  [35, 4],
  [36, 3],
  [36, 4],

  [60, 47],
  [61, 47],
  [62, 47],
  [60, 48],
  [61, 48],
  [62, 48],
  [60, 49],
  [61, 49],
  [62, 49],
  [60, 51],
  [61, 51],
  [62, 51],

  [60, 67],
  [61, 67],
  [62, 67],
  [60, 68],
  [61, 68],
  [62, 68],
  [60, 69],
  [61, 69],
  [62, 69],
  [60, 71],
  [61, 71],
  [62, 71],

  [80, 67],
  [81, 67],
  [82, 67],
  [80, 68],
  [81, 68],
  [82, 68],
  [80, 69],
  [81, 69],
  [82, 69],
  [80, 71],
  [81, 71],
  [82, 71],
]
// younes 
const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

class Game {
  constructor(n=10){
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.size = this.canvas.width / n
    this.n = n
    this.seed = document.querySelector('.btn-seed')
    this.playing = false
    this.buildColors(.1,0,2,4,200,50)
    this.buildGrid()
    this.seedGrid()
    this.setupEvents()    
    this.sizeCanvas()
  }

  buildColors(frequency, phase1, phase2, phase3, center=128, width=127, len=50) {
    const colors = []

    for (let i = 0; i < len; i++) {
      const red = Math.floor(Math.sin(frequency * i + phase1) * width + center);
      const grn = Math.floor(Math.sin(frequency * i + phase2) * width + center);
      const blu = Math.floor(Math.sin(frequency * i + phase3) * width + center);
      colors.push(`rgb(${red}, ${grn}, ${blu})`)      
    }

    this.colors = colors
  }

  getColor() {
    const r = getRandom(0, this.colors.length)
    return this.colors[r]
  }

  buildGrid() {    
    const arr = []

    for (let i = 0; i < this.n; i++) {
      arr[i] = []
      for (let j = 0; j < this.n; j++) {
        
        const cell = {
          color: this.colors[j],
          val: 0,
        }

        arr[i][j] = cell
      }
    }
    
    this.grid = arr  
    this.draw()
  }

  seedGrid() {    
    seed.forEach(i => {
      const x = i[0]
      const y = i[1]
      const cell = {
        val: 1,
        color: this.getColor()
      }
      this.grid[x][y] = cell
      this.grid[x][this.n - y] = cell
      this.grid[this.n - x][y] = cell
      this.grid[this.n - x][this.n - y] = cell
    })
    
    this.seed.classList.add('hidden')
    this.draw()
  }

  setupEvents(){
    this.start = document.querySelector('.btn-start')
    this.start.addEventListener('click', () => this.handleStart())

    this.reset = document.querySelector('.btn-reset')
    this.reset.addEventListener('click', () => this.handleReset())

    this.seed = document.querySelector('.btn-seed')
    this.seed.addEventListener('click', () => this.seedGrid())

    this.canvas.addEventListener('mouseup', (e) => this.handleUp(e))
    this.canvas.addEventListener('mousedown', (e) => this.handleDown(e))
    this.canvas.addEventListener('mousemove', (e) => this.dragCell(e))
    this.canvas.addEventListener('click', (e) => this.clickCell(e))
    
    window.addEventListener('resize', () => this.sizeCanvas())
  }

  handleReset() {
    this.seed.classList.remove('hidden')
    this.reset.classList.add('hidden')
    this.stopGame()
    this.buildGrid()
  }

  handleStart() {
    this.playing ? this.stopGame() : this.startGame()
  }

  handleDown(e) {
    this.dragging = true
  }

  handleUp(e) {
    this.dragging = false
  }

  clickCell(e) {
    this.stopGame()
    const pos = this.getMousePos(e)
    this.fillCell(pos) 
  }
// not sure 
  dragCell(e) {
    if (!this.dragging) return false

    const pos = this.getMousePos(e)  
    this.fillCell(pos)
  }

  fillCell(pos){
    const x = Math.floor(pos.x / this.size)
    const y = Math.floor(pos.y / this.size)
    //ahmed 
// grid 
    const color = this.grid[x][y].color
    const val = this.grid[x][y].val

    const cell = {
      color, 
      val: val == 1 ? (this.dragging ? 1 : 0) : 1
    }

    this.grid[x][y] = cell
    this.grid[this.n - x][y] = cell

    this.draw()
  }


  sizeCanvas(){
    const width = window.innerWidth
    this.canvas.width = width
    this.canvas.height = width
    this.size = width / this.n
    this.draw()
  }
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  getNeighbors(arr, x, y) {
    let count = 0

    const checkArr = (x, y) => {
      if (arr[x] && arr[x][y]) {
        return arr[x][y].val === 1 ? true : false;
      }
      // return cell && cell.val §§!
    }
    

    // top left
    if (checkArr(x - 1, y - 1)) count++;

    // top mid
    if (checkArr(x - 1, y)) count++;

    // top right
    if (checkArr(x - 1, y + 1)) count++;

    // mid left
    if (checkArr(x, y - 1)) count++;

    // mid right
    if (checkArr(x, y + 1)) count++;

    // bottom left
    if (checkArr(x + 1, y - 1)) count++;

    // bottom mid
    if (checkArr(x + 1, y)) count++;

    // bottom right
    if (checkArr(x + 1, y + 1)) count++;

    return count
  }

  updateGrid() {

    const updated = this.grid.map((row, x) => {      
      return row.map((cell, y) => {
        
        const n = this.getNeighbors(this.grid, x, y) ;
        
        // lliv cellule 
        if (cell.val === 1) {
          return cell = {
            color: cell.color,
            val: (n === 2 || n === 3) ? 1 : 0,
          }
        // dead cellule
        } else {
          return cell = {
            color: cell.color,
            val: (n === 3) ? 1 : 0,
          }
        }
      })
    })

    this.grid = updated ;

    this.raf = requestAnimationFrame(() => this.draw())
  }

  draw() {
    const ctx = this.ctx ;
    const size = this.size;
    const grid = this.grid.slice();

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)  ;  
    ctx.strokeStyle = "#E5E5E5";;
    ctx.strokeWidth = 0.5;

    grid.forEach((row, x) => {
      row.forEach((cell, y) => {
        ctx.beginPath();
        ctx.rect(x * size, y * size, size, size);
        if (cell.val === 1) {
          ctx.fillStyle = cell.color ;
          ctx.fill();
        } 
      })
    })

    if (this.playing) this.updateGrid()
  }

  startGame() {
    this.reset.classList.remove('hidden');
    this.start.textContent = 'Stop';

    this.playing = true;
    this.draw();
  }

  stopGame() {
    this.start.textContent = 'Start' ;
    this.playing = false;

    cancelAnimationFrame(this.raf);
    this.raf = null

  }
}

new Game(160) ; 