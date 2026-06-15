require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

/* ---------------- CREATE DATA FOLDER ---------------- */

const dataDir = path.join(__dirname, "../../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

/* ---------------- SAMPLE DATA ---------------- */

const branches = [
  "CSE",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL"
];

const subjects = [
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Artificial Intelligence",
  "Machine Learning",
  "Compiler Design",
  "Signals",
  "VLSI",
  "Thermodynamics",
  "Fluid Mechanics",
  "Structural Analysis",
  "Engineering Maths",
  "Physics",
  "Chemistry",
  "Java Programming",
  "Python Programming",
  "Data Structures",
  "Theory of Computation",
  "Cloud Computing",
  "Software Engineering"
];

const students = [];
const exams = [];
const registrations = [];

/* =======================================================
   GENERATE STUDENTS
======================================================= */

for (let i = 1; i <= 500; i++) {

  const branch =
    branches[
      Math.floor(Math.random() * branches.length)
    ];

  const year =
    Math.floor(Math.random() * 4) + 1;

  students.push({

    hallTicket:
      `22${branch.slice(0, 2)}${String(i).padStart(3, "0")}`,

    name: `Student_${i}`,

    branch,

    year

  });
}

/* =======================================================
   GENERATE EXAMS
======================================================= */

for (let i = 1; i <= 20; i++) {

  const branch =
    branches[
      Math.floor(Math.random() * branches.length)
    ];

  const year =
    Math.floor(Math.random() * 4) + 1;

  exams.push({

    subjectCode:
      `SUB${String(i).padStart(3, "0")}`,

    subjectName:
      subjects[i - 1],

    branch,

    year,

    examDate:
      `2026-06-${String((i % 10) + 1).padStart(2, "0")}`,

    session:
      i % 2 === 0 ? "FN" : "AN"

  });
}

/* =======================================================
   GENERATE REGISTRATIONS
======================================================= */

const registrationSet = new Set();

while (registrations.length < 3000) {

  const student =
    students[
      Math.floor(Math.random() * students.length)
    ];

  const exam =
    exams[
      Math.floor(Math.random() * exams.length)
    ];

  const uniqueKey =
    `${student.hallTicket}-${exam.subjectCode}`;

  /* Avoid duplicate registrations */

  if (!registrationSet.has(uniqueKey)) {

    registrationSet.add(uniqueKey);

    registrations.push({

      hallTicket:
        student.hallTicket,

      subjectCode:
        exam.subjectCode

    });
  }
}

/* =======================================================
   CSV WRITERS
======================================================= */

/* ---------------- STUDENTS CSV ---------------- */

const studentWriter =
  createObjectCsvWriter({

    path:
      path.join(
        dataDir,
        "students.csv"
      ),

    header: [

      {
        id: "hallTicket",
        title: "hallTicket"
      },

      {
        id: "name",
        title: "name"
      },

      {
        id: "branch",
        title: "branch"
      },

      {
        id: "year",
        title: "year"
      }

    ]

  });

/* ---------------- EXAMS CSV ---------------- */

const examWriter =
  createObjectCsvWriter({

    path:
      path.join(
        dataDir,
        "exams.csv"
      ),

    header: [

      {
        id: "subjectCode",
        title: "subjectCode"
      },

      {
        id: "subjectName",
        title: "subjectName"
      },

      {
        id: "branch",
        title: "branch"
      },

      {
        id: "year",
        title: "year"
      },

      {
        id: "examDate",
        title: "examDate"
      },

      {
        id: "session",
        title: "session"
      }

    ]

  });

/* ---------------- REGISTRATIONS CSV ---------------- */

const registrationWriter =
  createObjectCsvWriter({

    path:
      path.join(
        dataDir,
        "registrations.csv"
      ),

    header: [

      {
        id: "hallTicket",
        title: "hallTicket"
      },

      {
        id: "subjectCode",
        title: "subjectCode"
      }

    ]

  });

/* =======================================================
   WRITE CSV FILES
======================================================= */

async function generateCSV() {

  try {

    await studentWriter.writeRecords(students);

    console.log(
      "students.csv generated"
    );

    await examWriter.writeRecords(exams);

    console.log(
      "exams.csv generated"
    );

    await registrationWriter.writeRecords(registrations);

    console.log(
      "registrations.csv generated"
    );

    console.log(
      "All CSV files generated successfully"
    );

  } catch (error) {

    console.error(
      "Error generating CSV files:",
      error
    );
  }
}

generateCSV();