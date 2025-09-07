import React, { useState } from "react";
import "./../styles/Recommendations.css";

/**
 * Recommendations.jsx
 * - 3 Location modes: GPS, Manual Lat/Lon, Address
 * - Address -> Lat/Lon using OpenStreetMap (Nominatim API)
 * - "Open in Google Maps" works for both coordinates & address
 * - Jharkhand-specific soil/crop categories
 */

const Recommendations = () => {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    areaType: "Plain",
    soilType: "",
    waterSources: [],
    previousCrop: "",
    harvestedDate: "",
    expectedSeedingMonth: "",
    landAcres: "",
    croppingType: "Short-term",
    cropCategory: "",
  });

  const [locationMode, setLocationMode] = useState("gps"); // gps | manual | address
  const [addressData, setAddressData] = useState({
    state: "",
    district: "",
    pincode: "",
  });

  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        waterSources: checked
          ? [...prev.waterSources, value]
          : prev.waterSources.filter((src) => src !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle address field changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  // GPS Location detection
  const handleLocationDetect = async () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationStatus("Requesting location permission...");
    setLocationAccuracy(null);

    try {
      const bestPosition = await getBestPosition({
        sampleDuration: 5000,
        timeout: 8000,
      });

      if (!bestPosition) {
        setLocationStatus(
          "Unable to get a precise location. Try again outdoors with GPS on."
        );
        return;
      }

      const lat = Number(bestPosition.coords.latitude.toFixed(6));
      const lon = Number(bestPosition.coords.longitude.toFixed(6));
      const acc = Math.round(bestPosition.coords.accuracy);

      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
      setLocationAccuracy(acc);
      setLocationStatus(`Location detected — accuracy ~ ${acc} m`);
    } catch (err) {
      console.error("Location error:", err);
      setLocationStatus(
        "Failed to detect location. Please allow permission or try again outdoors."
      );
    }
  };

  // Collects best GPS fix
  const getBestPosition = ({ sampleDuration = 5000, timeout = 8000 } = {}) => {
    return new Promise((resolve, reject) => {
      let best = null;
      let watchId = null;
      let settled = false;

      const clear = () => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      };

      const onSuccess = (pos) => {
        if (!best || pos.coords.accuracy < best.coords.accuracy) {
          best = pos;
        }
      };

      const onError = (err) => {
        if (!settled) {
          settled = true;
          clear();
          reject(err);
        }
      };

      try {
        watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout,
        });
      } catch (err) {
        reject(err);
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!best || pos.coords.accuracy < best.coords.accuracy) best = pos;
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 0, timeout: Math.min(3000, timeout) }
      );

      setTimeout(() => {
        if (!settled) {
          settled = true;
          clear();
          if (best) resolve(best);
          else reject(new Error("No position obtained"));
        }
      }, sampleDuration);
    });
  };

  // Open Google Maps with lat/lon or address
  const openInGoogleMaps = () => {
    const { latitude, longitude } = formData;

    if (latitude && longitude) {
      // ✅ If lat/lon available, open coordinates
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(url, "_blank");
    } else if (addressData.state || addressData.district || addressData.pincode) {
      // ✅ If address available, open address search
      const query = `${addressData.district}, ${addressData.state}, ${addressData.pincode}, India`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`;
      window.open(url, "_blank");
    } else {
      alert("No location data available. Enter coordinates or address first.");
    }
  };

  // Convert address -> lat/lon
  const fetchCoordinatesFromAddress = async () => {
    const { state, district, pincode } = addressData;
    const query = `${district}, ${state}, ${pincode}, India`;

    setLocationStatus("Fetching coordinates for address...");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
        setLocationStatus("📍 Location detected from address");
      } else {
        setLocationStatus("❌ Could not find location. Check spelling/pincode.");
      }
    } catch (err) {
      console.error(err);
      setLocationStatus("⚠️ Error fetching coordinates. Try again.");
    }
  };

  // Submit form to ML backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.landAcres < 0) {
      alert("Land acres must be greater than or equal to 0.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error calling recommendation API. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendation-container">
      <h2 className="recommendation-title">🌱 Crop Recommendation (Jharkhand)</h2>

      <form className="recommendation-form" onSubmit={handleSubmit}>
        {/* Location Mode Selector */}
        <div className="recommendation-form-group" style={{ gridColumn: "span 2" }}>
          <label>Location Input Mode</label>
          <select
            value={locationMode}
            onChange={(e) => setLocationMode(e.target.value)}
          >
            <option value="gps">📡 Use GPS</option>
            <option value="manual">✏️ Enter Latitude & Longitude</option>
            <option value="address">🏠 Enter Address (State, District, Pincode)</option>
          </select>
        </div>

        {/* GPS Mode */}
        {locationMode === "gps" && (
          <div className="recommendation-form-group" style={{ gridColumn: "span 2" }}>
            <button
              type="button"
              className="recommendation-location-btn"
              onClick={handleLocationDetect}
            >
              📍 Detect My Location
            </button>
            <button
              type="button"
              className="recommendation-openmaps-btn"
              onClick={openInGoogleMaps}
              style={{ marginTop: 8 }}
            >
              🗺️ Open in Google Maps
            </button>
            <div className="recommendation-location-info">{locationStatus}</div>
            {locationAccuracy && (
              <div className="recommendation-location-accuracy">
                Accuracy: ~{locationAccuracy} m
              </div>
            )}
          </div>
        )}

        {/* Manual Lat/Lon Mode */}
        {locationMode === "manual" && (
          <>
            <div className="recommendation-form-group">
              <label>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="any"
                required
              />
            </div>
            <div className="recommendation-form-group">
              <label>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="any"
                required
              />
            </div>
            <div className="recommendation-form-group" style={{ gridColumn: "span 2" }}>
              <button
                type="button"
                className="recommendation-openmaps-btn"
                onClick={openInGoogleMaps}
              >
                🗺️ Open in Google Maps
              </button>
            </div>
          </>
        )}

        {/* Address Mode */}
        {locationMode === "address" && (
          <div
            className="recommendation-form-group"
            style={{ gridColumn: "span 2" }}
          >
            <label>State</label>
            <input
              type="text"
              name="state"
              value={addressData.state}
              onChange={handleAddressChange}
              required
            />
            <label>District</label>
            <input
              type="text"
              name="district"
              value={addressData.district}
              onChange={handleAddressChange}
              required
            />
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={addressData.pincode}
              onChange={handleAddressChange}
              required
            />
            <button
              type="button"
              className="recommendation-location-btn"
              style={{ marginTop: 10 }}
              onClick={fetchCoordinatesFromAddress}
            >
              🔍 Get Coordinates from Address
            </button>
            <button
              type="button"
              className="recommendation-openmaps-btn"
              style={{ marginTop: 10 }}
              onClick={openInGoogleMaps}
            >
              🗺️ Open in Google Maps
            </button>
            <div className="recommendation-location-info">{locationStatus}</div>
          </div>
        )}

        {/* Area Type */}
        <div className="recommendation-form-group">
          <label>Area Type</label>
          <select
            name="areaType"
            value={formData.areaType}
            onChange={handleChange}
          >
            <option value="Plain">Plain</option>
            <option value="Mountain">Mountain</option>
            <option value="Plateau">Plateau</option>
          </select>
        </div>

        {/* Soil Type */}
        <div className="recommendation-form-group">
          <label>Soil Type (Jharkhand)</label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            required
          >
            <option value="">Select Soil</option>
            <option value="Red">Red Soil</option>
            <option value="Laterite">Laterite Soil</option>
            <option value="Sandy">Sandy Soil</option>
            <option value="Loamy">Loamy Soil</option>
            <option value="Clay">Clay Soil</option>
            <option value="Alluvial">Alluvial Soil</option>
          </select>
        </div>

        {/* Water Sources */}
        <div className="recommendation-form-group">
          <label>Water Sources</label>
          <div className="recommendation-checkbox-group">
            {["Rainfed", "Canal", "Borewell", "River", "Pond"].map((src) => (
              <label key={src}>
                <input
                  type="checkbox"
                  value={src}
                  checked={formData.waterSources.includes(src)}
                  onChange={handleChange}
                />
                {src}
              </label>
            ))}
          </div>
        </div>

        {/* Previous Crop */}
        <div className="recommendation-form-group">
          <label>Previous Crop Harvested</label>
          <input
            type="text"
            name="previousCrop"
            placeholder="E.g. Rice, Maize"
            value={formData.previousCrop}
            onChange={handleChange}
          />
          <label>Harvested Date</label>
          <input
            type="date"
            name="harvestedDate"
            value={formData.harvestedDate}
            onChange={handleChange}
          />
        </div>

        {/* Expected Seeding */}
        <div className="recommendation-form-group">
          <label>Expected Seeding Month</label>
          <input
            type="month"
            name="expectedSeedingMonth"
            value={formData.expectedSeedingMonth}
            onChange={handleChange}
            required
          />
        </div>

        {/* Land Acres */}
        <div className="recommendation-form-group">
          <label>Land Acres</label>
          <input
            type="number"
            name="landAcres"
            min="0"
            value={formData.landAcres}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cropping Type */}
        <div className="recommendation-form-group">
          <label>Cropping Type</label>
          <select
            name="croppingType"
            value={formData.croppingType}
            onChange={handleChange}
          >
            <option value="Short-term">Short-term</option>
            <option value="Long-term">Long-term</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        {/* Crop Category */}
        <div className="recommendation-form-group">
          <label>Crop Category</label>
          <select
            name="cropCategory"
            value={formData.cropCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Pulses">Pulses</option>
            <option value="Cereals">Cereals</option>
            <option value="Oilseeds">Oilseeds</option>
            <option value="Cash Crops">Cash Crops</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="recommendation-submit-btn"
          disabled={loading}
        >
          {loading ? "Processing..." : "Get Recommendation"}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="recommendation-result">
          <h3 className="recommendation-result-title">
            🌾 Recommended Crop: {result.recommendedCrop}
          </h3>
          <p>Duration: {result.cropDurationDays} days</p>

          <div className="recommendation-growth-stages">
            <h4>Growth Stages:</h4>
            <ul>
              {result.growthStages.map((stage, idx) => (
                <li key={idx}>{stage}</li>
              ))}
            </ul>
          </div>

          <div className="recommendation-investment-card">
            <h4>💰 Investment & Profit</h4>
            <p>Investment: ₹{result.investment}</p>
            <p>Profit: ₹{result.profit}</p>
            <p>ROI: {result.roi}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
