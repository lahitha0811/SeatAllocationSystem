const createSeatMatrix =
  (rows, cols) => {

    return Array(rows)
      .fill(null)
      .map(() =>
        Array(cols).fill(null)
      );
  };

module.exports =
  createSeatMatrix;