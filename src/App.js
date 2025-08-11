import React, { useState } from "react";
import "./App.css";

function App() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [price, setPrice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call your backend API for Uber price prediction
    try {
      const response = await fetch("http://localhost:8080/api/uber-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, drop }),
      });

      const data = await response.json();
      setPrice(data.price); // assuming backend returns { "price": value }
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  return (
    <div className="container">
      <h1>Uber Price Prediction</h1>
      <form onSubmit={handleSubmit}>
        <label>Pickup Location:</label>
        <input
          type="text"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          required
        />

        <label>Drop Location:</label>
        <input
          type="text"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          required
        />

        <button type="submit">Get Price</button>
      </form>

      {price !== null && (
        <div className="result">
          <h2>Estimated Price: ₹{price}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
