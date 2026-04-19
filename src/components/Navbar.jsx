function Navbar() {
  return (
    <nav className="navbar">
      <h1
        onClick={() => window.location.reload()}
        style={{ cursor: "pointer" }}
      >
        🍽️ What’s Cookin’? 🍽️
      </h1>
      <p>Discover, save, and cook your favourite meals</p>
    </nav>
  );
}

export default Navbar;
