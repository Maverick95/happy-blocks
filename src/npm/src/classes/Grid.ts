import Coordinate from 'models/Coordinate';

interface UpdatePieceResult {
  from: Coordinate,
  to: Coordinate,
};

interface DeleteRowsResult {
  delete: Coordinate[],
  update: UpdatePieceResult[],
};

class Grid {

  #width: number;
  #height: number;
  #grid: number[][];
  #occupiedByRow: number[];
  
  constructor(width: number, height: number) {
    if (width < 0 || height < 0) {
      throw new Error('Invalid arguments');
    }
    this.#width = width;
    this.#height = height;
    this.#grid = [];
    this.#occupiedByRow = [];
    this.#updateGridDimensions();
  }

  getWidth = (): number => this.#width;

  getHeight = (): number => this.#height;

  setWidth = (value: number): void => {
    if (value < 1 || value > 10) {
      throw new Error('Incorrect attribute');
    }
    this.#width = value;
    this.#updateGridDimensions();
  };

  setHeight = (value: number): void => {
    if (value < 1 || value > 20) {
      throw new Error('Incorrect attribute');
    }
    this.#height = value;
    this.#updateGridDimensions();
  };

  setSpace = (value: number, x: number, y: number): void => {
    if (value <= 0 || x < 0 || x >= this.#width || y >= this.#height) {
      throw new Error('Incorrect attribute');
    }
    if (y >= 0) {
      if (!this.#grid[y][x]) {
        this.#occupiedByRow[y]++;
      }
      this.#grid[y][x] = value;
    }
  }

  getSpace = (x: number, y: number): number => {
    if (x < 0 || x >= this.#width || y < 0 || y >= this.#height) {
      return undefined;
    } 
    return this.#grid[y][x];
  }

  getOccupiedForRow = (y: number) => {
    if (y < 0 || y >= this.#height) {
      return undefined;
    }
    return this.#occupiedByRow[y];
  }

  deleteRows(rows: number[]): DeleteRowsResult {
    if (rows.some(row => row < 0 || row >= this.#height)) {
      throw new Error('Incorrect attribute');
    }

    const rowsToDelete = [...rows].sort((a, b) => b - a)
      .filter((value, index, array) => index === 0 || value !== array[index - 1]);

    const result_delete: Coordinate[] = rowsToDelete.map(y =>
      this.#grid[y].map((id, x) => ({ x, y, id }))
      .filter(coordinate => coordinate.id > 0)
    ).flat();

    const rowsToUpdate = rowsToDelete.map((value, index, array) => {
      const last = index === array.length - 1;
      const start = last ? 0 : (array[index + 1] + 1);
      return {
        target: start + (index + 1),
        start,
        end: value,
        last,
      };
    }).filter(value => value.end > value.start);

    const result_update: UpdatePieceResult[] = rowsToUpdate.map(rows =>
      new Array(rows.end - rows.start)
        .fill(0)
        .map((_, index) => rows.start + index)
        .map(y => this.#grid[y]
          .map((id, x) => (
            {
              from: { x, y, id },
              to: { x, y: y + rows.target - rows.start, id }
            }))
          .filter(coordinate => coordinate.from.id > 0)
      )
    ).flat(2)
    
    rowsToUpdate.forEach(({target, start, end, last}) => {
      this.#grid.copyWithin(target, start, end);
      this.#occupiedByRow.copyWithin(target, start, end);
      if (last) {
        for (let i=0; i < target; i++) {
          this.#grid[i] = new Array(this.#width).fill(0);
          this.#occupiedByRow[i] = 0;
        }
      }
    });

    return {
      delete: result_delete,
      update: result_update,
    };
  }

  clearSpace = (x: number, y: number): void => {
    if (x < 0 || x >= this.#width || y >= this.#height) {
      throw new Error('Incorrect attribute');
    }
    if (y >= 0 && this.#grid[y][x]) {
      this.#grid[y][x] = 0;
      this.#occupiedByRow[y]--;
    }
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
      this.#occupiedByRow.splice(this.#height);
    }
    else if (this.#height > height) {
      for (let i=0; i < this.#height - height; i++) {
        this.#grid.push(new Array(this.#width).fill(0));
      }
      this.#occupiedByRow.splice(
        height, 0,
        ...new Array(this.#height - height).fill(0));
    }

  };
};

export {
  Grid,
  UpdatePieceResult,
  DeleteRowsResult,
};

