import {
  useEffect,
  useState
} from "react";

import axios from "../../api/axios";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

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

const AllocationAnalytics =
  () => {

    const [
      analytics,
      setAnalytics
    ] = useState(null);

    useEffect(() => {

      fetchAnalytics();

    }, []);

    const fetchAnalytics =
      async () => {

        const res =
          await axios.get(
            "/analytics"
          );

        setAnalytics(
          res.data
        );
      };

    if (!analytics)
      return <h2>
        Loading...
      </h2>;

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
      <div
        style={{
          padding: "20px"
        }}
      >

        <h1>
          Analytics Dashboard
        </h1>

        {/* KPI CARDS */}

       <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    marginBottom: "30px"
  }}
>
  <div
    style={{
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 10px rgba(0,0,0,0.1)"
    }}
  >
    <h2
      style={{
        fontSize: "32px",
        margin: 0
      }}
    >
      {analytics.totalAllocated}
    </h2>

    <p>Total Allocated</p>
  </div>

  <div
    style={{
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 10px rgba(0,0,0,0.1)"
    }}
  >
    <h2
      style={{
        fontSize: "32px",
        margin: 0
      }}
    >
      {analytics.allocationScore}
    </h2>

    <p>Allocation Score</p>
  </div>
</div>

        {/* PIE CHART */}

        <h2>
          Branch Distribution
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
                  data={branchData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >

              {
                branchData.map(
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
                )
              }

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

        {/* BAR CHART */}

        <h2>
          Room Utilization
        </h2>

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
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>
      </div>
</div>
    );
};

export default
  AllocationAnalytics;