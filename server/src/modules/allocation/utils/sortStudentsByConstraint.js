const sortStudentsByConstraint =
  (students) => {

    const branchGroups = {};

    /* ---------------- GROUP BY BRANCH ---------------- */

    students.forEach((student) => {

      if (
        !branchGroups[
          student.branch
        ]
      ) {

        branchGroups[
          student.branch
        ] = [];
      }

      branchGroups[
        student.branch
      ].push(student);
    });

    /* ---------------- SHUFFLE EACH BRANCH ---------------- */

    Object.values(
      branchGroups
    ).forEach((group) => {

      for (
        let i =
          group.length - 1;
        i > 0;
        i--
      ) {

        const j =
          Math.floor(
            Math.random() *
            (i + 1)
          );

        [
          group[i],
          group[j]
        ] = [
          group[j],
          group[i]
        ];
      }
    });

    /* ---------------- INTERLEAVE ---------------- */

    const branches =
      Object.keys(
        branchGroups
      );

    const result = [];

    let added = true;

    while (added) {

      added = false;

      for (
        const branch
        of branches
      ) {

        if (
          branchGroups[
            branch
          ].length > 0
        ) {

          result.push(

            branchGroups[
              branch
            ].shift()
          );

          added = true;
        }
      }
    }

    return result;
  };

module.exports =
  sortStudentsByConstraint;