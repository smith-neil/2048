import Board, { Cell } from "./Board";

describe('Board', () => {
  it('constructs itself', () => {
    const cell = new Cell(1, 2, 3);

    expect(cell.id).toBeTruthy();
    expect(cell.x).toBe(1);
    expect(cell.y).toBe(2);
    expect(cell.value).toBe(3);
  });
});

describe('Matrix', () => {
  it('constructs with an immutable matrix', () => {
    const m = [[1, 2, 3], [3, 2, 1]];
    const first = new Board(m);
    const second = new Board(m);

    expect(first.matrix).not.toBe(second.matrix);
  });

  it('getEmptyCoords', () => {
    const m = new Board([[null, null, new Cell(1, 2, 3)], [new Cell(1, 2, 3), null, null]]);
    const emptyCoords = m.getEmptyCoords();
    
    expect(emptyCoords.length).toBe(4);
    expect(emptyCoords[0]).toEqual({x:0, y:0});
    expect(emptyCoords[1]).toEqual({x:1, y:0});
    expect(emptyCoords[2]).toEqual({x:1, y:1});
    expect(emptyCoords[3]).toEqual({x:2, y:1});
  });

  it('addsRandomCell', () => {
    const m = new Board([[null, null], [null, null]]);
    m.addRandomCell();
    
    const emptyCoords = m.getEmptyCoords();
    const { matrix } = m;
    let newCell = null;
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] !== null) {
          newCell = matrix[y][x];
        }
      }
    }

    expect(emptyCoords.length).toBe(3);
    expect(newCell).toHaveProperty('id');
    expect(newCell).toHaveProperty('x');
    expect(newCell).toHaveProperty('y');
  });

  it('shiftsLeft', () => {
    const m = new Board([[null, null, new Cell(2, 0)], [null, new Cell(1, 1), null]]);
    m.shiftLeft();

    const { matrix } = m;
    const cells = [];
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] !== null) {
          cells.push(matrix[y][x]);
        }
      }
    }
    
    expect(cells.length).toBe(2);
    expect(cells[0]).toHaveProperty("x", 0);
    expect(cells[0]).toHaveProperty("y", 0);
    expect(cells[1]).toHaveProperty("x", 0);
    expect(cells[1]).toHaveProperty("y", 1);
  });

  it('shiftsRight', () => {
    const m = new Board([[new Cell(0, 0), null, null], [null, new Cell(1, 1), null]]);
    m.shiftRight();

    const { matrix } = m;
    const cells = [];
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] !== null) {
          cells.push(matrix[y][x]);
        }
      }
    }

    expect(cells.length).toBe(2);
    expect(cells[0]).toHaveProperty("x", 2);
    expect(cells[0]).toHaveProperty("y", 0);
    expect(cells[1]).toHaveProperty("x", 2);
    expect(cells[1]).toHaveProperty("y", 1);
  });

  it('combinesLeft', () => {
    const m = new Board([
      [new Cell(0, 0, 2), new Cell(1, 0, 2), null],
      [new Cell(0, 1, 2), new Cell(1, 1, 4), new Cell(2, 1, 4)]
    ]);
    m.combineLeft();

    const { matrix } = m;

    expect(matrix[0][0]).toHaveProperty("x", 0);
    expect(matrix[0][0]).toHaveProperty("y", 0);
    expect(matrix[0][0]).toHaveProperty("value", 4);
    expect(matrix[0][1]).toBe(null);
    expect(matrix[0][2]).toBe(null);

    expect(matrix[1][0]).toHaveProperty("x", 0);
    expect(matrix[1][0]).toHaveProperty("y", 1);
    expect(matrix[1][0]).toHaveProperty("value", 2);
    expect(matrix[1][1]).toHaveProperty("x", 1);
    expect(matrix[1][1]).toHaveProperty("y", 1);
    expect(matrix[1][1]).toHaveProperty("value", 8);
    expect(matrix[1][2]).toBe(null);
  });

  it('combinesRight', () => {
    const m = new Board([
      [null, new Cell(1, 0, 2), new Cell(2, 0, 2)],
      [new Cell(0, 1, 2), new Cell(1, 1, 4), new Cell(2, 1, 4)]
    ]);
    m.combineRight();

    const { matrix } = m;

    expect(matrix[0][0]).toBe(null);
    expect(matrix[0][1]).toBe(null);
    expect(matrix[0][2]).toHaveProperty("x", 2);
    expect(matrix[0][2]).toHaveProperty("y", 0);
    expect(matrix[0][2]).toHaveProperty("value", 4);
    
    expect(matrix[1][0]).toHaveProperty("x", 0);
    expect(matrix[1][0]).toHaveProperty("y", 1);
    expect(matrix[1][0]).toHaveProperty("value", 2);
    expect(matrix[1][1]).toBe(null);
    expect(matrix[1][2]).toHaveProperty("x", 2);
    expect(matrix[1][2]).toHaveProperty("y", 1);
    expect(matrix[1][2]).toHaveProperty("value", 8);
  });

  it('rotatesLeft', () => {
    const m = new Board([
      [new Cell(0, 0, 2), null],
      [null, new Cell(1, 1, 4)]
    ]);
    m.rotateLeft();

    const { matrix } = m;

    expect(matrix[0][0]).toBe(null);
    expect(matrix[0][1]).toHaveProperty("x", 1);
    expect(matrix[0][1]).toHaveProperty("y", 0);
    expect(matrix[0][1]).toHaveProperty("value", 4);
    expect(matrix[1][0]).toHaveProperty("x", 0);
    expect(matrix[1][0]).toHaveProperty("y", 1);
    expect(matrix[1][0]).toHaveProperty("value", 2);
    expect(matrix[1][1]).toBe(null);
  });

  it('rotatesRight', () => {
    const m = new Board([
      [new Cell(0, 0, 2), null],
      [null, new Cell(1, 1, 4)]
    ]);
    m.rotateRight();

    const { matrix } = m;

    expect(matrix[0][0]).toBe(null);
    expect(matrix[0][1]).toHaveProperty("x", 1);
    expect(matrix[0][1]).toHaveProperty("y", 0);
    expect(matrix[0][1]).toHaveProperty("value", 2);
    expect(matrix[1][0]).toHaveProperty("x", 0);
    expect(matrix[1][0]).toHaveProperty("y", 1);
    expect(matrix[1][0]).toHaveProperty("value", 4);
    expect(matrix[1][1]).toBe(null);
  });

  it('movesLeft', () => {
    const m = new Board([
      [new Cell(0, 0, 2), new Cell(1, 0, 2), null, null],
      [new Cell(0, 1, 2), null, new Cell(2, 1, 2), null],
      [new Cell(0, 2, 4), new Cell(1, 2, 4), new Cell(2, 2, 2), new Cell(3, 2, 2)],
      [null, null, null, null]
    ]);
    m.moveLeft();

    const { matrix } = m;

    expect(matrix[0][0]).toHaveProperty("x", 0);
    expect(matrix[0][0]).toHaveProperty("y", 0);
    expect(matrix[0][0]).toHaveProperty("value", 4);
    expect(matrix[0][1]).toBe(null);
    expect(matrix[0][2]).toBe(null);
    expect(matrix[0][3]).toBe(null);

    expect(matrix[1][0]).toHaveProperty("x", 0);
    expect(matrix[1][0]).toHaveProperty("y", 1);
    expect(matrix[1][0]).toHaveProperty("value", 4);
    expect(matrix[1][1]).toBe(null);
    expect(matrix[1][2]).toBe(null);
    expect(matrix[1][3]).toBe(null);

    expect(matrix[2][0]).toHaveProperty("x", 0);
    expect(matrix[2][0]).toHaveProperty("y", 2);
    expect(matrix[2][0]).toHaveProperty("value", 8);
    expect(matrix[2][1]).toHaveProperty("x", 1);
    expect(matrix[2][1]).toHaveProperty("y", 2);
    expect(matrix[2][1]).toHaveProperty("value", 4);
    expect(matrix[2][2]).toBe(null);
    expect(matrix[2][3]).toBe(null);
  });

  it('movesRight', () => {
    const m = new Board([
      [new Cell(0, 0, 2), new Cell(1, 0, 2), null, null],
      [new Cell(0, 1, 2), null, new Cell(2, 1, 2), null],
      [new Cell(0, 2, 4), new Cell(1, 2, 4), new Cell(2, 2, 2), new Cell(3, 2, 2)],
      [null, null, null, null]
    ]);
    m.moveRight();

    const { matrix } = m;

    expect(matrix[0][0]).toBe(null);
    expect(matrix[0][1]).toBe(null);
    expect(matrix[0][2]).toBe(null);
    expect(matrix[0][3]).toHaveProperty("x", 3);
    expect(matrix[0][3]).toHaveProperty("y", 0);
    expect(matrix[0][3]).toHaveProperty("value", 4);

    expect(matrix[1][0]).toBe(null);
    expect(matrix[1][1]).toBe(null);
    expect(matrix[1][2]).toBe(null);
    expect(matrix[1][3]).toHaveProperty("x", 3);
    expect(matrix[1][3]).toHaveProperty("y", 1);
    expect(matrix[1][3]).toHaveProperty("value", 4);

    expect(matrix[2][0]).toBe(null);
    expect(matrix[2][1]).toBe(null);
    expect(matrix[2][2]).toHaveProperty("x", 2);
    expect(matrix[2][2]).toHaveProperty("y", 2);
    expect(matrix[2][2]).toHaveProperty("value", 8);
    expect(matrix[2][3]).toHaveProperty("x", 3);
    expect(matrix[2][3]).toHaveProperty("y", 2);
    expect(matrix[2][3]).toHaveProperty("value", 4);
  });

  it('movesUp', () => {
    const m = new Board([
      [new Cell(0, 0, 2), new Cell(1, 0, 2), null, null],
      [new Cell(0, 1, 2), null, new Cell(2, 1, 2), null],
      [new Cell(0, 2, 4), new Cell(1, 2, 4), new Cell(2, 2, 2), new Cell(3, 2, 2)],
      [null, null, null, null]
    ]);
    m.moveUp();

    const { matrix } = m;

    expect(matrix[0][0]).toHaveProperty("x", 0);
    expect(matrix[0][0]).toHaveProperty("y", 0);
    expect(matrix[0][0]).toHaveProperty("value", 4);
    expect(matrix[1][0]).toHaveProperty("x", 0);
    expect(matrix[1][0]).toHaveProperty("y", 1);
    expect(matrix[1][0]).toHaveProperty("value", 4);
    expect(matrix[2][0]).toBe(null);
    expect(matrix[3][0]).toBe(null);

    expect(matrix[0][1]).toHaveProperty("x", 1);
    expect(matrix[0][1]).toHaveProperty("y", 0);
    expect(matrix[0][1]).toHaveProperty("value", 2);
    expect(matrix[1][1]).toHaveProperty("x", 1);
    expect(matrix[1][1]).toHaveProperty("y", 1);
    expect(matrix[1][1]).toHaveProperty("value", 4);
    expect(matrix[2][1]).toBe(null);
    expect(matrix[3][1]).toBe(null);

    expect(matrix[0][2]).toHaveProperty("x", 2);
    expect(matrix[0][2]).toHaveProperty("y", 0);
    expect(matrix[0][2]).toHaveProperty("value", 4);
    expect(matrix[1][2]).toBe(null);
    expect(matrix[2][2]).toBe(null);
    expect(matrix[3][2]).toBe(null);

    expect(matrix[0][3]).toHaveProperty("x", 3);
    expect(matrix[0][3]).toHaveProperty("y", 0);
    expect(matrix[0][3]).toHaveProperty("value", 2);
    expect(matrix[1][3]).toBe(null);
    expect(matrix[2][3]).toBe(null);
    expect(matrix[3][3]).toBe(null);
  });

  it('movesDown', () => {
    const m = new Board([
      [new Cell(0, 0, 2), new Cell(1, 0, 2), null, null],
      [new Cell(0, 1, 2), null, new Cell(2, 1, 2), null],
      [new Cell(0, 2, 4), new Cell(1, 2, 4), new Cell(2, 2, 2), new Cell(3, 2, 2)],
      [null, null, null, null]
    ]);
    m.moveDown();

    const { matrix } = m;

    expect(matrix[0][0]).toBe(null);
    expect(matrix[1][0]).toBe(null);
    expect(matrix[2][0]).toHaveProperty("x", 0);
    expect(matrix[2][0]).toHaveProperty("y", 2);
    expect(matrix[2][0]).toHaveProperty("value", 4);
    expect(matrix[3][0]).toHaveProperty("x", 0);
    expect(matrix[3][0]).toHaveProperty("y", 3);
    expect(matrix[3][0]).toHaveProperty("value", 4);

    expect(matrix[0][1]).toBe(null);
    expect(matrix[1][1]).toBe(null);
    expect(matrix[2][1]).toHaveProperty("x", 1);
    expect(matrix[2][1]).toHaveProperty("y", 2);
    expect(matrix[2][1]).toHaveProperty("value", 2);
    expect(matrix[3][1]).toHaveProperty("x", 1);
    expect(matrix[3][1]).toHaveProperty("y", 3);
    expect(matrix[3][1]).toHaveProperty("value", 4);

    expect(matrix[0][2]).toBe(null);
    expect(matrix[1][2]).toBe(null);
    expect(matrix[2][2]).toBe(null);
    expect(matrix[3][2]).toHaveProperty("x", 2);
    expect(matrix[3][2]).toHaveProperty("y", 3);
    expect(matrix[3][2]).toHaveProperty("value", 4);

    expect(matrix[0][3]).toBe(null);
    expect(matrix[1][3]).toBe(null);
    expect(matrix[2][3]).toBe(null);
    expect(matrix[3][3]).toHaveProperty("x", 3);
    expect(matrix[3][3]).toHaveProperty("y", 3);
    expect(matrix[3][3]).toHaveProperty("value", 2);
  });
});
