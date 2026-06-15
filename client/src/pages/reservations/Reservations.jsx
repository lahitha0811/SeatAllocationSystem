import { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await API.get("/reservations");
      setReservations(res.data.reservations || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div className="reservations-page">
          <h1 className="page-title">Reservations</h1>

          <p className="page-subtitle">
            View and manage all room reservations
          </p>

          <div className="reservations-table-wrapper">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Purpose</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {reservations.length > 0 ? (
                  reservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td>
                        {reservation?.roomId?.roomNumber ||
                          reservation?.roomId?.name ||
                          "-"}
                      </td>

                      <td>{reservation.purpose}</td>

                      <td>
                        {new Date(
                          reservation.startTime
                        ).toLocaleString()}
                      </td>

                      <td>
                        {new Date(
                          reservation.endTime
                        ).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            reservation.status
                          )}`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="empty-row"
                    >
                      No reservations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservations;