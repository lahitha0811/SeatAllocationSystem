// src/components/SeatCard.jsx
import React from "react";

const branchColors = {
  CSE: "bg-blue-500",
  ECE: "bg-green-500",
  EEE: "bg-red-500",
  MECH: "bg-yellow-400",
  CIVIL: "bg-purple-500",
  EMPTY: "bg-gray-200 text-gray-500",
};

const SeatCard = ({ seat }) => {
  const isEmpty = !seat || !seat.hallTicket;
  const colorClass = isEmpty
    ? branchColors.EMPTY
    : branchColors[seat.branch] || "bg-gray-300";

  return (
    <div
      className={`relative rounded shadow flex flex-col items-center justify-center h-16 w-16 cursor-pointer ${colorClass} transition duration-200`}
    >
      {isEmpty ? (
        <span>EMPTY</span>
      ) : (
        <>
          <span className="font-bold text-white">{seat.hallTicket}</span>
          <span className="text-xs text-white">{seat.branch}</span>
          <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col items-center">
            <div className="bg-black text-white text-xs rounded px-2 py-1 shadow-lg">
              <div>Subject: {seat.subjectCode}</div>
              <div>Session: {seat.session}</div>
            </div>
            <div className="w-3 h-3 bg-black rotate-45 -mt-1"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default SeatCard;