import { Link } from "react-router-dom";
import "../../styles/dashboard.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <Link to="/dashboard">
        Dashboard
      </Link>

      <Link to="/rooms">
        Rooms
      </Link>

      <Link to="/manage-rooms">
        Manage Rooms
      </Link>

      <Link to="/seat-allocation">
        Seat Allocation
      </Link>

      <Link to="/analytics">
        Analytics
      </Link>

      <Link to="/allocations/visualizer">
        Room Visualizer
      </Link>

      <Link to="/create-reservation">
           Create Reservation
      </Link>

      <Link to="/reservations">
        Reservations
      </Link>

      <Link to="/approvals">
        Approvals
      </Link>

    </div>
  );
}

export default Sidebar;