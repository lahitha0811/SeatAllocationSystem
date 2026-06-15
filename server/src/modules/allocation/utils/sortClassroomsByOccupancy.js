const sortClassroomsByOccupancy =
  (classrooms) => {

    return classrooms.sort(
      (a, b) => {

        const countOccupied =
          (matrix) => {

            let count = 0;

            matrix.forEach((row) => {

              row.forEach((seat) => {

                if (seat) {
                  count++;
                }
              });
            });

            return count;
          };

        return (
          countOccupied(b.matrix) -
          countOccupied(a.matrix)
        );
      }
    );
  };

module.exports =
  sortClassroomsByOccupancy;