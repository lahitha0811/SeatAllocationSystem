import { useEffect, useState } from "react";
import axios from "../../api/axios";
import branchColors from "../../constants/branchColors";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const RoomVisualizer = () => {
  const [allocations, setAllocations] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [rooms, setRooms] = useState([]);

  /* ---------------- FETCH ROOMS ---------------- */

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/classrooms");

      const roomList =
        res.data.classrooms || [];

      setRooms(roomList);

      if (roomList.length > 0) {
        setRoomNumber(
          roomList[0].roomNumber
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- FETCH ALLOCATIONS ---------------- */

  useEffect(() => {
    if (roomNumber) {
      fetchRoomData();
    }
  }, [roomNumber]);

  const fetchRoomData = async () => {
    try {
      const res = await axios.get(
        `/allocations/${roomNumber}`
      );

      // console.log(
      //   "Room:",
      //   roomNumber
      // );

      // console.log(
      //   "Allocations:",
      //   res.data
      // );

      setAllocations(
        res.data.allocations || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- MATRIX ---------------- */

  const maxRow = Math.max(
    ...allocations.map(
      (allocation) => allocation.row
    ),
    0
  );

  const maxCol = Math.max(
    ...allocations.map(
      (allocation) => allocation.col
    ),
    0
  );

  const matrix = Array.from(
    { length: maxRow + 1 },
    () => Array(maxCol + 1).fill(null)
  );

  allocations.forEach((allocation) => {
    matrix[allocation.row][allocation.col] =
      allocation;
  });

  /* ---------------- STATS ---------------- */

  const occupiedSeats =
    allocations.length;

  const totalSeats =
    (maxRow + 1) * (maxCol + 1);

  const occupancy =
    totalSeats > 0
      ? (
          (occupiedSeats /
            totalSeats) *
          100
        ).toFixed(2)
      : 0;

  // console.log("Rooms:", rooms);
  // console.log(
  //   "Selected Room:",
  //   roomNumber
  // );
  // console.log(
  //   "Allocations:",
  //   allocations
  // );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div className="visualizer-container">

          <h1 className="visualizer-title">
            Room Visualizer
          </h1>

          {/* Controls */}

          <div className="control-card">

            <select
              className="room-select"
              value={roomNumber}
              onChange={(e) =>
                setRoomNumber(
                  e.target.value
                )
              }
            >
              {rooms.map((room) => (
                <option
                  key={room._id}
                  value={room.roomNumber}
                >
                  {room.roomNumber}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search Hall Ticket"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              value={branchFilter}
              onChange={(e) =>
                setBranchFilter(
                  e.target.value
                )
              }
            >
              <option value="ALL">
                All Branches
              </option>

              <option value="CSE">
                CSE
              </option>

              <option value="ECE">
                ECE
              </option>

              <option value="EEE">
                EEE
              </option>

              <option value="MECH">
                MECH
              </option>

              <option value="CIVIL">
                CIVIL
              </option>
            </select>

          </div>

          {/* Stats */}

          <div className="stats-grid">

            <div className="stat-box">
              <h4>
                Occupied Seats
              </h4>

              <h2>
                {occupiedSeats}
              </h2>
            </div>

            <div className="stat-box">
              <h4>
                Total Seats
              </h4>

              <h2>
                {totalSeats}
              </h2>
            </div>

            <div className="stat-box">
              <h4>
                Occupancy
              </h4>

              <h2>
                {occupancy}%
              </h2>
            </div>

          </div>

          {/* Legend */}

          <div className="legend-card">

            {Object.keys(
              branchColors
            ).map((branch) => (
              <div
                key={branch}
                className="legend-item"
              >
                <div
                  className="legend-color"
                  style={{
                    backgroundColor:
                      branchColors[
                        branch
                      ]
                  }}
                />

                {branch}
              </div>
            ))}

          </div>

          {/* Room Grid */}

          <div className="room-grid-wrapper">

            {matrix.map(
              (row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="row-container"
                >
                  <div className="row-label">
                    Row {rowIndex + 1}
                  </div>

                  {row.map(
                    (
                      seat,
                      colIndex
                    ) => (
                      <div
                        key={colIndex}
                        className={`seat-box ${
                          !seat
                            ? "seat-empty"
                            : ""
                        } ${
                          seat &&
                          seat.hallTicket
                            ?.toLowerCase()
                            .includes(
                              search.toLowerCase()
                            )
                            ? "seat-highlight"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            seat
                              ? (
                                  branchFilter ===
                                    "ALL" ||
                                  seat.branch ===
                                    branchFilter
                                )
                                ? branchColors[
                                    seat.branch
                                      ?.trim()
                                      ?.toUpperCase()
                                  ]
                                : "#d1d5db"
                              : undefined,

                          color: seat
                            ? "#fff"
                            : "#6b7280"
                        }}
                      >
                        {seat &&
                        (branchFilter ===
                          "ALL" ||
                          seat.branch ===
                            branchFilter) ? (
                          <>
                            <div>
                              {
                                seat.branch
                              }
                            </div>

                            <div>
                              {
                                seat.hallTicket
                              }
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    )
                  )}

                </div>
              )
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomVisualizer;