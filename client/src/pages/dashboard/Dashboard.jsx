import { useEffect, useState } from "react";
import API from "../../api/axios";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#ef4444"
];

function Dashboard() {

  const [stats, setStats] =
    useState(null);

  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {

    fetchStats();
    fetchAnalytics();

  }, []);

  const fetchStats =
    async () => {

      const res =
        await API.get(
          "/dashboard"
        );

      setStats(res.data);
    };

  const fetchAnalytics =
    async () => {

      const res =
        await API.get(
          "/analytics"
        );

      setAnalytics(
        res.data
      );
    };

  if (!stats || !analytics) {

    return <h2>Loading...</h2>;
  }

  const branchData =
    Object.entries(
      analytics.branchStats
    ).map(
      ([name, value]) => ({
        name,
        value
      })
    );

  const roomData =
    Object.entries(
      analytics.roomStats
    ).map(
      ([room, count]) => ({
        room,
        count
      })
    );

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <div className="stats-grid">

          <div className="stat-card">
            <h3>Rooms</h3>
            <h2>{stats.totalRooms}</h2>
          </div>

          <div className="stat-card">
            <h3>Allocations</h3>
            <h2>{stats.totalAllocations}</h2>
          </div>

          <div className="stat-card">
            <h3>Score</h3>
            <h2>{stats.allocationScore}</h2>
          </div>

          <div className="stat-card">
            <h3>Reservations</h3>
            <h2>{stats.totalReservations}</h2>
          </div>

        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
            padding: "20px"
          }}
        >

          <div className="stat-card">

            <h3>
              Branch Distribution
            </h3>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={branchData}
                  dataKey="value"
                  label
                >

                  {branchData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                            COLORS.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          <div className="stat-card">

            <h3>
              Room Utilization
            </h3>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart
                data={roomData}
              >

                <XAxis
                  dataKey="room"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;