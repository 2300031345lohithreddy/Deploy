import React, { useState } from "react";
import "./UberPricePrediction.css";

export default function UberPricePrediction() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState(5);
  const [time, setTime] = useState(12);
  const [service, setService] = useState("uberx");
  const [surge, setSurge] = useState(1);
  const [currency, setCurrency] = useState("INR");
  const [fare, setFare] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const services = {
    uberx: { label: "UberX", base: 40, perKm: 12, perMin: 1.8, booking: 30 },
    uberxl: { label: "UberXL", base: 60, perKm: 16, perMin: 2.4, booking: 40 },
    uberblack: { label: "Black", base: 100, perKm: 30, perMin: 4, booking: 60 },
  };

  const estimateFare = () => {
    const svc = services[service];
    const costDistance = svc.perKm * distance;
    const costTime = svc.perMin * time;
    const raw = svc.base + costDistance + costTime + svc.booking;
    const total = raw * Math.max(1, surge);

    const result = {
      base: svc.base,
      distanceCost: costDistance,
      timeCost: costTime,
      bookingFee: svc.booking,
      raw,
      surge: Math.max(1, surge),
      total: total.toFixed(2),
    };

    setFare(total.toFixed(2));
    setBreakdown(result);
  };

  const clearForm = () => {
    setPickup("");
    setDrop("");
    setDistance(5);
    setTime(12);
    setService("uberx");
    setSurge(1);
    setCurrency("INR");
    setFare(null);
    setBreakdown(null);
  };

  const tryParseLatLng = (text) => {
    if (!text) return null;
    const parts = text.split(",").map((s) => s.trim());
    if (parts.length !== 2) return null;
    const lat = Number(parts[0]),
      lng = Number(parts[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  };

  const buildUberDeepLink = (pickupStr, dropStr) => {
    const pickupCoords = tryParseLatLng(pickupStr);
    const dropCoords = tryParseLatLng(dropStr);

    const base = "https://m.uber.com/ul/?action=setPickup";
    const params = new URLSearchParams();

    if (pickupCoords) {
      params.set("pickup[latitude]", pickupCoords.lat);
      params.set("pickup[longitude]", pickupCoords.lng);
    } else if (pickupStr) {
      params.set("pickup[formatted_address]", pickupStr);
    } else {
      params.set("pickup", "true");
    }

    if (dropCoords) {
      params.set("dropoff[latitude]", dropCoords.lat);
      params.set("dropoff[longitude]", dropCoords.lng);
    } else if (dropStr) {
      params.set("dropoff[formatted_address]", dropStr);
    }

    return `${base}&${params.toString()}`;
  };

  return (
    <div className="container">
      <header>
        <h1>Uber Price Prediction — Demo</h1>
        <div className="small">Client-only estimator • Not official Uber fares</div>
      </header>

      {/* Form */}
      <section className="form">
        <h2>Trip details</h2>

        <label>Pickup (address or lat,lng)</label>
        <input
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="e.g. MG Road, Bangalore or 12.97,77.59"
        />

        <label>Drop (address or lat,lng)</label>
        <input
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          placeholder="e.g. Koramangala or 12.93,77.62"
        />

        <div className="row">
          <div>
            <label>Distance (km)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Trip time (minutes)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="row">
          <div>
            <label>Service type</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              {Object.entries(services).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Surge multiplier</label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={surge}
              onChange={(e) => setSurge(Number(e.target.value))}
            />
          </div>
        </div>

        <label>Currency</label>
        <input
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button onClick={estimateFare}>Estimate Fare</button>
          <button onClick={clearForm} className="clear-btn">
            Clear
          </button>
        </div>
      </section>

      {/* Results */}
      <aside>
        <div className="card">
          <div>
            <div className="muted">Estimated fare</div>
            <p className="result-amount">
              {fare ? `${currency} ${fare}` : "—"}
            </p>
            {breakdown && (
              <div className="small">
                {services[service].label} • {distance} km • {time} min • surge ×
                {breakdown.surge}
              </div>
            )}
          </div>

          {breakdown && (
            <div className="breakdown">
              <div>Base fare: {currency} {breakdown.base}</div>
              <div>Distance cost: {currency} {breakdown.distanceCost}</div>
              <div>Time cost: {currency} {breakdown.timeCost}</div>
              <div>Booking fee: {currency} {breakdown.bookingFee}</div>
              <div>Surge multiplier: ×{breakdown.surge}</div>
              <div><strong>Total: {currency} {breakdown.total}</strong></div>
            </div>
          )}

          <a
            href={buildUberDeepLink(pickup, drop)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            Open in Uber (deep link)
          </a>
        </div>
      </aside>
    </div>
  );
}
