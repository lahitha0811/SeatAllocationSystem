function RoomCard({ room }) {
  return (
    <div className="room-card">
      <h3>{room.roomNumber}</h3>

      <p>Rows: {room.rows}</p>

      <p>Columns: {room.cols}</p>

      <p>
        Capacity:
        {" "}
        {room.rows * room.cols}
      </p>
    </div>
  );
}

export default RoomCard;