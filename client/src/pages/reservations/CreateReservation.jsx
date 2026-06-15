import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

function CreateReservation() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const [formData, setFormData] = useState({
    roomId: "",
    purpose: "",
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get("/classrooms");
      //  console.log("ROOM RESPONSE:", res.data);
      setRooms(
        res.data.classrooms || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/reservations",
        formData
      );

      alert(
        "Reservation created successfully"
      );

      navigate("/reservations");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to create reservation"
      );
    }
  };

 // console.log("ROOM STATE:", rooms);
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div
          style={{
            padding: "30px"
          }}
        >
          <h1>
            Create Reservation
          </h1>

          <br />

          <form
            onSubmit={handleSubmit}
            className="room-form"
          >
            <label>
              Room
            </label>

            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Room
              </option>

              {rooms.map(
                (room) => (
                  <option
                    key={room._id}
                    value={room._id}
                  >
                    {
                      room.roomNumber
                    }
                  </option>
                )
              )}
            </select>

            <label>
              Purpose
            </label>

            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />

            <label>
              Start Time
            </label>

            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />

            <label>
              End Time
            </label>

            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Create Reservation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReservation;