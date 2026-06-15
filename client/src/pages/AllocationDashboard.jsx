// src/pages/AllocationDashboard.jsx
import React, { useState, useEffect } from "react";
import ControlPanel from "../components/ControlPanel";
import RoomGrid from "../components/RoomGrid";
import {
  runAllocation,
  getAllAllocations,
  getRoomAllocations,
} from "../services/allocationApi";

const DEFAULT_ROOM = "A101";

const AllocationDashboard = () => {
  const [session, setSession] = useState("FN");
  const [limit, setLimit] = useState(150);
  const [selectedRoom, setSelectedRoom] = useState(DEFAULT_ROOM);
  const [roomAllocations, setRoomAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch room allocations
  const fetchRoom = async (room = selectedRoom) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getRoomAllocations(room);
      setRoomAllocations(res.allocations || []);
    } catch (err) {
      setErrorMsg("Failed to load room data.");
      setRoomAllocations([]);
    }
    setLoading(false);
  };

  // On room or allocation change
  useEffect(() => {
    fetchRoom(selectedRoom);
    // eslint-disable-next-line
  }, [selectedRoom]);

  // Generate allocation handler
  const handleGenerate = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await runAllocation(session, limit);
      if (res.success) {
        setSuccessMsg(
          `Allocated ${res.allocatedStudents} students in ${res.executionTime}`
        );
        fetchRoom(selectedRoom);
      } else {
        setErrorMsg("Allocation failed.");
      }
    } catch {
      setErrorMsg("Allocation failed.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-2 py-6">
      <h1 className="text-2xl font-bold mb-4">Exam Hall Allocation Dashboard</h1>
      <ControlPanel
        session={session}
        setSession={setSession}
        limit={limit}
        setLimit={setLimit}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        onGenerate={handleGenerate}
      />
      {successMsg && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {errorMsg}
        </div>
      )}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          Room: {selectedRoom}
        </h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <RoomGrid allocations={roomAllocations} />
        )}
      </div>
    </div>
  );
};

export default AllocationDashboard;