require("dotenv").config();
const path = require("path");

const connectDB = require("../config/db");

const Student = require("../models/Student");
const Exam = require("../models/Exam");
const Registration = require("../models/registration.model");
const Classroom =require("../models/classroom");

const readCSV = require("../modules/allocation/utils/csvReader");

async function importData() {
  try {
    await connectDB();

    console.log("MongoDB connected");

    /* ---------------- FILE PATHS ---------------- */
const classroomsPath =
  path.join(
    __dirname,
    "../../data/classrooms.csv"
  );
const classrooms =
  await readCSV(classroomsPath);
await Classroom.deleteMany({});

await Classroom.insertMany(classrooms);

console.log(
  `${classrooms.length} classrooms inserted`
);

    const studentsPath = path.join(
      __dirname,
      "../../data/students.csv"
    );

    const examsPath = path.join(
      __dirname,
      "../../data/exams.csv"
    );

    const registrationsPath = path.join(
      __dirname,
      "../../data/registrations.csv"
    );

    /* ---------------- READ CSV ---------------- */

    const students = await readCSV(studentsPath);
    const exams = await readCSV(examsPath);
    const registrations = await readCSV(registrationsPath);

    console.log("CSV files loaded");

    /* ---------------- DELETE OLD DATA ---------------- */

    await Student.deleteMany({});
    await Exam.deleteMany({});
    await Registration.deleteMany({});

    console.log("Old data deleted");

    /* ---------------- INSERT STUDENTS ---------------- */

    await Student.insertMany(students);

    console.log(
      `${students.length} students inserted`
    );

    /* ---------------- INSERT EXAMS ---------------- */

    await Exam.insertMany(exams);

    console.log(
      `${exams.length} exams inserted`
    );

    /* ---------------- INSERT REGISTRATIONS ---------------- */

    await Registration.insertMany(registrations);

    console.log(
      `${registrations.length} registrations inserted`
    );

    console.log("Data import completed");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

importData();