class Grid {

  #width: number;
  #height: number;
  #grid: number[][];
  
  constructor(width: number, height: number) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0) {
      throw new Error('Invalid arguments');
    }
    this.#width = width;
    this.#height = height;
    this.#grid = [];
    this.#updateGridDimensions();
  }

  getWidth = (): number => this.#width;

  getHeight = (): number => this.#height;

  setWidth = (value: number): void => {
    if (!Number.isInteger(value) || value < 1 || value > 10) {
      throw new Error('Incorrect attribute');
    }
    this.#width = value;
    this.#updateGridDimensions();
  };

  setHeight = (value: number): void => {
    if (!Number.isInteger(value) || value < 1 || value > 20) {
      throw new Error('Incorrect attribute');
    }
    this.#height = value;
    this.#updateGridDimensions();
  };

  setSpace = (value: number, x: number, y: number): void => {
    if (!Number.isInteger(value) || !Number.isInteger(x) || !Number.isInteger(y) ||
    value <= 0 || x < 0 || x >= this.#width || y < 0 || y >= this.#height) {
      throw new Error('Incorrect attribute');
    }
    this.#grid[x][y] = value;
  }

  getSpace = (x: number, y: number): number => {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new Error('Incorrect attribute');
    }
    if (x < 0 || x >= this.#width || y < 0 || y >= this.#height) {
      return undefined;
    } 
    return this.#grid[x][y];
  }

  clearSpace = (x: number, y: number): void => {
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x >= this.#width || y < 0 || y >= this.#height) {
      throw new Error('Incorrect attribute');
    }
    this.#grid[x][y] = 0;
  }

  #updateGridDimensions = (): void => {

    const width = this.#grid[0]?.length ?? 0;
    
    if (this.#width < width) {
      this.#grid.forEach(row => row.splice(this.#width));
    }
    else if (this.#width > width) {
      this.#grid.forEach(row => row.splice(
        this.#width, 0,
        ...new Array(this.#width - width).fill(0)));
    }

    const height = this.#grid.length;

    if (this.#height < height) {
      this.#grid.splice(this.#height);
    }
    else if (this.#height > height) {
      for (let i=0; i < this.#height - height; i++) {
        this.#grid.push(new Array(this.#width).fill(0));
      }
    }

  };
};

export default Grid;