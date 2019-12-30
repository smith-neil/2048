import uuidv1 from "uuid/v1";
import { getRandom, padEnd } from "./helpers";

// TODO: update score in combineLeft and combineRight

export class Cell {
  constructor(x, y, value = 2) {
    this.id = uuidv1();
    this.x = x;
    this.y = y;
    this.value = value;
  }
}

export default class Board {
  constructor(matrix) {
    this.matrix = JSON.parse(JSON.stringify(matrix));
  }

  getEmptyCoords = () => {
    const result = [];
    this.matrix.map((row, y) =>
      row.map((cell, x) => {
        if (!cell) result.push({ x, y });
      })
    );
    return result;
  };

  addRandomCell = () => {
    const { matrix } = this;
    const emptyCoords = this.getEmptyCoords();

    if (emptyCoords.length === 0) {
      // TODO: board is full, game over
    }

    const coord = getRandom(emptyCoords);
    const value = getRandom([2, 4]);
    matrix[coord.y][coord.x] = new Cell(coord.x, coord.y, value);

    return matrix;
  };

  shiftLeft = () => {
    const { matrix } = this;
    const newMatrix = [];

    for (let y = 0; y < matrix.length; y++) {
      const len = matrix[y].length;

      // remove all null then pad to len
      let newRow = matrix[y].filter(e => e != null);
      newRow.forEach((el, x) => {
        el.x = x;
        el.y = y;
      });
      newRow = padEnd(newRow, len, null);
      newMatrix.push(newRow);
    }

    this.matrix = newMatrix;
    return this.matrix;
  };

  shiftRight = () => {
    const { matrix } = this;
    const newMatrix = [];

    for (let y = 0; y < matrix.length; y++) {
      const len = matrix[y].length;

      // remove all null then padstart to len
      let newRow = matrix[y].filter(e => e != null);
      while (newRow.length < len) {
        newRow.unshift(null);
      }
      newRow.forEach((el, x) => {
        if (el !== null) {
          el.x = x;
          el.y = y;
        }
      });
      newMatrix.push(newRow);
    }

    this.matrix = newMatrix;
    return this.matrix;
  };

  combineLeft = () => {
    const { matrix } = this;

    for (let y = 0; y < matrix.length; y++) {
      const len = matrix[y].length;

      for (let x = 0; x < len - 1; x++) {
        // if cell is not null
        // and the next cell's value is equal
        // then double this cell's value and set the next to null
        const cell = matrix[y][x];
        const nextCell = matrix[y][x + 1];

        if (cell && nextCell && cell.value === nextCell.value) {
          matrix[y][x].value *= 2;
          matrix[y][x + 1] = null;
        }
      }
    }

    return matrix;
  };

  combineRight = () => {
    const { matrix } = this;

    for (let y = 0; y < matrix.length; y++) {
      const len = matrix[y].length;

      for (let x = len; x > 0; x--) {
        const cell = matrix[y][x];
        const nextCell = matrix[y][x - 1];

        if (cell && nextCell && cell.value === nextCell.value) {
          matrix[y][x].value *= 2;
          matrix[y][x - 1] = null;
        }
      }
    }

    return matrix;
  };

  rotateLeft = () => {
    const { matrix } = this;
    const len = matrix.length;
    const newMatrix = [];

    for (let y = len - 1; y >= 0; y--) {
      const newRow = [];
      for (let x = matrix[y].length - 1; x >= 0; x--) {
        newRow.unshift(matrix[x][y]);
      }
      newMatrix.push(newRow);
    }

    // fix the coords on the moved cells
    for (let y = 0; y < newMatrix.length; y++) {
      for (let x = 0; x < newMatrix[y].length; x++) {
        if (newMatrix[y][x]) {
          newMatrix[y][x].x = x;
          newMatrix[y][x].y = y;
        }
      }
    }

    this.matrix = newMatrix;
    return this.matrix;
  };

  rotateRight = () => {
    const { matrix } = this;
    const newMatrix = [];

    for (let y = 0; y < matrix.length; y++) {
      const newRow = [];
      for (let x = matrix[y].length - 1; x >= 0; x--) {
        newRow.push(matrix[x][y]);
      }
      newMatrix.push(newRow);
    }

    // fix the coords on the moved cells
    for (let y = 0; y < newMatrix.length; y++) {
      for (let x = 0; x < newMatrix[y].length; x++) {
        if (newMatrix[y][x]) {
          newMatrix[y][x].x = x;
          newMatrix[y][x].y = y;
        }
      }
    }

    this.matrix = newMatrix;
    return this.matrix;
  };

  moveLeft = () => {
    this.shiftLeft();
    this.combineLeft();
    this.shiftLeft();
    return this.matrix;
  };

  moveRight = () => {
    this.shiftRight();
    this.combineRight();
    this.shiftRight();
    return this.matrix;
  };

  moveUp = () => {
    this.rotateRight();
    this.shiftRight();
    this.combineRight();
    this.shiftRight();
    this.rotateLeft();
    return this.matrix;
  };

  moveDown = () => {
    this.rotateLeft();
    this.shiftRight();
    this.combineRight();
    this.shiftRight();
    this.rotateRight();
    return this.matrix;
  };
}
