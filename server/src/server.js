require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const authRoutes = require("./modules/auth/auth.routes");
const classroomRoutes = require("./modules/classroom/classroom.routes.js");
const allocationRoutes = require("./modules/allocation/allocation.routes");
const reservationRoutes = require("./modules/reservations/reservation.routes");
const approvalRoutes = require("./modules/approvals/approval.routes");
const analyticsRoutes = require("./modules/allocation/analytics.routes");
const dashboardRoutes = require( "./modules/dashboard/dashboard.routes");

app.use("/api/analytics", analyticsRoutes);

app.use("/api/approvals", approvalRoutes);

app.use( "/api/dashboard", dashboardRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/classrooms", classroomRoutes);

app.use("/api/allocations", allocationRoutes);

app.use("/api/reservations", reservationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});