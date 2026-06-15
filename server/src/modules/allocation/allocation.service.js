const Student =
  require("../../models/Student");

const Registration =
  require("../../models/registration.model");

const Classroom =
  require("../../models/Classroom");

const Exam =
  require("../../models/Exam");

const buildAllocationData =
  async () => {

    /* ---------------- FETCH DATA ---------------- */

    const students =
      await Student.find();

    const registrations =
      await Registration.find();

    const classrooms =
      await Classroom.find();

    const exams =
      await Exam.find();

    /* ---------------- STUDENT MAP ---------------- */

    const studentMap = {};

    students.forEach((student) => {

      studentMap[
        student.hallTicket
      ] = student;
    });

    /* ---------------- EXAM MAP ---------------- */

    const examMap = {};

    exams.forEach((exam) => {

      examMap[
        exam.subjectCode
      ] = exam;
    });

    /* ---------------- BUILD ALLOCATION DATA ---------------- */

    const allocationData =
      registrations
        .map((reg) => {

          const student =
            studentMap[
              reg.hallTicket
            ];

          const exam =
            examMap[
              reg.subjectCode
            ];

          /* Skip invalid data */

          if (
            !student ||
            !exam
          ) {
            return null;
          }

          return {

            hallTicket:
              reg.hallTicket,

            branch:
              student.branch,

            year:
              student.year,

            subjectCode:
              reg.subjectCode,

            examDate:
              exam.examDate,

            session:
              exam.session
          };
        })

        .filter(Boolean);
console.log(
  "Students fetched:",
  students.length
);

console.log(
  "Registrations fetched:",
  registrations.length
);

console.log(
  "Exams fetched:",
  exams.length
);

console.log(
  "AllocationData built:",
  allocationData.length
);

console.log(
  allocationData.slice(0, 5)
);
    return {

      allocationData,

      classrooms
    };
  };

module.exports = {
  buildAllocationData
};