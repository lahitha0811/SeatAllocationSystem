function Button({ title, onClick, type = "button" }) {
  return (
    <button type={type} onClick={onClick} className="btn">
      {title}
    </button>
  );
}

export default Button;