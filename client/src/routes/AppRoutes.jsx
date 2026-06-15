import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import Rooms from "../pages/rooms/Rooms";
import ManageRooms from "../pages/rooms/ManageRooms";
import SeatAllocation from "../pages/allocations/SeatAllocation";
import AllocationAnalytics from "../pages/allocations/AllocationAnalytics";
import Reservations from "../pages/reservations/Reservations";
import Approvals from "../pages/approvals/Approvals";
import NotFound from "../pages/notfound/NotFound";
import RoomVisualizer from "../pages/allocations/RoomVisualizer";
import CreateReservation from "../pages/reservations/CreateReservation";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/manage-rooms" element={<ManageRooms />} />
      <Route path="/seat-allocation" element={<SeatAllocation />} />
      <Route path="/analytics" element={<AllocationAnalytics />} />
      <Route path="/create-reservation" element={<CreateReservation />}/>
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/approvals" element={<Approvals />} />
      <Route path="*" element={<NotFound />} />
      <Route  path="/allocations/visualizer" element={<RoomVisualizer /> }/>
    </Routes>
  );
}

export default AppRoutes;