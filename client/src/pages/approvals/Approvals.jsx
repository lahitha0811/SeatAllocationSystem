import { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

function Approvals() {

  const [requests, setRequests] =
    useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests =
    async () => {

      try {

        const res =
          await API.get(
            "/reservations"
          );

        setRequests(
          (res.data.reservations || []).filter(
            (reservation) =>
              reservation.status === "pending"
          )
        );

      } catch (error) {

        console.log(error);
      }
    };

  const approveRequest =
    async (id) => {

      try {

        await API.patch(
          `/reservations/${id}/approve`
        );

        fetchRequests();

      } catch (error) {

        console.log(error);
      }
    };

  const rejectRequest =
    async (id) => {

      try {

        await API.patch(
          `/reservations/${id}/reject`
        );

        fetchRequests();

      } catch (error) {

        console.log(error);
      }
    };

  return (
<div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />
    <div style={{ padding: "20px" }}>

      <h2>
        Reservation Approvals
      </h2>

      {requests.map(
        (request) => (

          <div
            key={request._id}
            className="approval-card"
          >

            <p>
              <strong>
                Purpose:
              </strong>{" "}
              {request.purpose}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {request.status}
            </p>

            <button
              onClick={() =>
                approveRequest(
                  request._id
                )
              }
              style={{
                marginRight: "10px"
              }}
            >
              Approve
            </button>

            <button
              onClick={() =>
                rejectRequest(
                  request._id
                )
              }
            >
              Reject
            </button>

          </div>
        )
      )}
      </div>
      </div>
    </div>
  );
}

export default Approvals;