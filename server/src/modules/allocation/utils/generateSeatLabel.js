function generateSeatLabel(
  row,
  col
) {
  const rowLetter =
    String.fromCharCode(65 + row);

  return `${rowLetter}${col + 1}`;
}

module.exports =
  generateSeatLabel;