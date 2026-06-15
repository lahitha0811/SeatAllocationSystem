import { useState } from "react";
import API from "../../api/axios";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

function ManageRooms() {

  const [roomData, setRoomData] =
    useState({

      roomNumber: "",
      rows: "",
      cols: ""
    });

  const handleChange = (
    e
  ) => {

    setRoomData({

      ...roomData,

      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await API.post(
          "/classrooms",
          roomData
        );

        alert(
          "Room Created"
        );

        setRoomData({

          roomNumber: "",
          rows: "",
          cols: ""
        });

      } catch (error) {

        console.log(error);
      }
    };

  return (
<div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />
    
    <div className="form-page">

      <form
        onSubmit={
          handleSubmit
        }
        className="room-form"
      >

        <h2>
          Add Room
        </h2>

        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          value={
            roomData.roomNumber
          }
          onChange={
            handleChange
          }
        />

        <input
          type="number"
          name="rows"
          placeholder="Rows"
          value={
            roomData.rows
          }
          onChange={
            handleChange
          }
        />

        <input
          type="number"
          name="cols"
          placeholder="Columns"
          value={
            roomData.cols
          }
          onChange={
            handleChange
          }
        />

        <button
          type="submit"
        >
          Create Room
        </button>

      </form>
      </div>
      </div>
    </div>
  );
}

export default ManageRooms;