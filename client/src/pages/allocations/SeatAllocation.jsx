import { useState } from "react";
import API from "../../api/axios";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function SeatAllocation() {
  const [session, setSession] = useState("FN");
  const [limit, setLimit] = useState(150);
  const [allocations, setAllocations] = useState([]);

  const generateAllocation = async () => {
    try {
      const res = await API.post(
        "/allocations/run",
        {
          session,
          limit
        }
      );

      setAllocations(
        res.data.allocations ||
        res.data.data ||
        []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const exportExcel = () => {
    if (!allocations.length) {
      alert("Generate allocation first");
      return;
    }

    const excelData = allocations.map(
      (a) => ({
        HallTicket: a.hallTicket,
        Branch: a.branch,
        Room: a.roomNumber,
        Seat: `(${a.row}, ${a.col})`
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Seat Allocation"
    );

    XLSX.writeFile(
      workbook,
      "SeatAllocation.xlsx"
    );
  };

  const exportPDF = () => {
  if (!allocations.length) {
    alert("Generate allocation first");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Seat Allocation Report", 14, 15);

  autoTable(doc, {
    startY: 25,

    head: [[
      "Hall Ticket",
      "Branch",
      "Room",
      "Seat"
    ]],

    body: allocations.map((a) => [
      a.hallTicket,
      a.branch,
      a.roomNumber,
      `(${a.row}, ${a.col})`
    ])
  });

  doc.save("SeatAllocation.pdf");
};

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
          <h2
            style={{
              marginBottom: "25px",
              fontSize: "28px",
              fontWeight: "700"
            }}
          >
            Seat Allocation Engine
          </h2>

          {/* Controls */}

          <div
            style={{
              display: "flex",
              gap: "25px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "25px",
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600"
                }}
              >
                Session
              </label>

              <select
                value={session}
                onChange={(e) =>
                  setSession(
                    e.target.value
                  )
                }
                style={{
                  padding:
                    "10px 15px",
                  borderRadius:
                    "8px",
                  border:
                    "1px solid #d1d5db",
                  minWidth:
                    "120px"
                }}
              >
                <option value="FN">
                  FN
                </option>

                <option value="AN">
                  AN
                </option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600"
                }}
              >
                Limit
              </label>

              <input
                type="number"
                value={limit}
                onChange={(e) =>
                  setLimit(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={{
                  padding:
                    "10px 15px",
                  borderRadius:
                    "8px",
                  border:
                    "1px solid #d1d5db",
                  width: "120px"
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "25px"
            }}
          >
            <button
              onClick={
                generateAllocation
              }
              style={{
                background:
                  "#2563eb",
                color: "white",
                border: "none",
                padding:
                  "12px 22px",
                borderRadius:
                  "10px",
                cursor:
                  "pointer",
                fontWeight:
                  "600"
              }}
            >
              Generate Allocation
            </button>

            <button
              onClick={
                exportExcel
              }
              style={{
                background:
                  "#16a34a",
                color: "white",
                border: "none",
                padding:
                  "12px 22px",
                borderRadius:
                  "10px",
                cursor:
                  "pointer",
                fontWeight:
                  "600"
              }}
            >
              Export Excel
            </button>

            <button
              onClick={
                exportPDF
              }
              style={{
                background:
                  "#dc2626",
                color: "white",
                border: "none",
                padding:
                  "12px 22px",
                borderRadius:
                  "10px",
                cursor:
                  "pointer",
                fontWeight:
                  "600"
              }}
            >
              Export PDF
            </button>
          </div>

          {/* Allocation Count */}

          <div
            style={{
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "600"
            }}
          >
            Total Allocations:
            {" "}
            {allocations.length}
          </div>

          {/* Table */}

          <div
            style={{
              background: "white",
              borderRadius:
                "12px",
              overflow:
                "hidden",
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.08)"
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse"
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#2563eb",
                    color:
                      "white"
                  }}
                >
                  <th style={{ padding: "14px" }}>
                    Hall Ticket
                  </th>

                  <th style={{ padding: "14px" }}>
                    Branch
                  </th>

                  <th style={{ padding: "14px" }}>
                    Room
                  </th>

                  <th style={{ padding: "14px" }}>
                    Seat
                  </th>
                </tr>
              </thead>

              <tbody>
                {allocations.map(
                  (
                    allocation
                  ) => (
                    <tr
                      key={
                        allocation._id
                      }
                      style={{
                        borderBottom:
                          "1px solid #e5e7eb"
                      }}
                    >
                      <td
  style={{
    padding: "12px",
    textAlign: "center"
  }}
>
                        {
                          allocation.hallTicket
                        }
                      </td>

                      <td
  style={{
    padding: "12px",
    textAlign: "center"
  }}
>
                        {
                          allocation.branch
                        }
                      </td>

                      <td
  style={{
    padding: "12px",
    textAlign: "center"
  }}
>
                        {
                          allocation.roomNumber
                        }
                      </td>

                      <td
  style={{
    padding: "12px",
    textAlign: "center"
  }}
>
                        (
                        {
                          allocation.row
                        }
                        ,
                        {
                          allocation.col
                        }
                        )
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatAllocation;