import { useEffect, useState } from "react";
import API from "../../api/axios";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import RoomCard from "../../components/cards/RoomCard";

function Rooms() {

  const [rooms, setRooms] =
    useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms =
    async () => {

      try {

        const res =
          await API.get(
            "/classrooms"
          );

          //console.log(res.data);

        setRooms(
          res.data.classrooms || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <div className="room-grid">

          {rooms.map(room => (

            <RoomCard
              key={room._id}
              room={room}
            />

          ))}

        </div>

      </div>

    </div>
  );
}

export default Rooms;