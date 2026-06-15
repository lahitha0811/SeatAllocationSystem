function createSeatGrid(rows, cols) {
  const grid = [];

  for (let i = 0; i < rows; i++) {
    const row = [];

    for (let j = 0; j < cols; j++) {
      row.push(null);
    }

    grid.push(row);
  }

  return grid;
}

module.exports = createSeatGrid;