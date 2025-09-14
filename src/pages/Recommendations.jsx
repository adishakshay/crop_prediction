import React, { useContext, useState } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { languages } from "../utils/languages";
import "./../styles/Recommendations.css";

/**
 * Recommendations.jsx
 * - Multi-language integrated (English, Hindi, Sanskrit)
 * - Labels, buttons, placeholders auto-change with profile language
 */

const Recommendations = () => {
  const { lang } = useContext(LanguageContext);
  const t = languages[lang]; // ✅ translation object

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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  // GPS Location detection (unchanged)
  const handleLocationDetect = async () => {
    if (!("geolocation" in navigator)) {
      alert(t.geoNotSupported);
      return;
    }
    setLocationStatus(t.requestingLocation);
    setLocationAccuracy(null);

    try {
      const bestPosition = await getBestPosition({
        sampleDuration: 5000,
        timeout: 8000,
      });

      if (!bestPosition) {
        setLocationStatus(t.noPreciseLocation);
        return;
      }

      const lat = Number(bestPosition.coords.latitude.toFixed(6));
      const lon = Number(bestPosition.coords.longitude.toFixed(6));
      const acc = Math.round(bestPosition.coords.accuracy);

      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lon }));
      setLocationAccuracy(acc);
      setLocationStatus(`${t.locationDetected} ~ ${acc} m`);
    } catch (err) {
      setLocationStatus(t.locationFailed);
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

  // Open Google Maps
  const openInGoogleMaps = () => {
    const { latitude, longitude } = formData;
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(url, "_blank");
    } else if (addressData.state || addressData.district || addressData.pincode) {
      const query = `${addressData.district}, ${addressData.state}, ${addressData.pincode}, India`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`;
      window.open(url, "_blank");
    } else {
      alert(t.noLocationAvailable);
    }
  };

  // Address -> coordinates
  const fetchCoordinatesFromAddress = async () => {
    const { state, district, pincode } = addressData;
    const query = `${district}, ${state}, ${pincode}, India`;

    setLocationStatus(t.fetchingCoordinates);

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
        setLocationStatus(t.locationFromAddress);
      } else {
        setLocationStatus(t.locationNotFound);
      }
    } catch (err) {
      setLocationStatus(t.errorFetchingCoordinates);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      alert(t.apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendation-container">
      <h2 className="recommendation-title">{t.recommendationTitle}</h2>

      <form className="recommendation-form" onSubmit={handleSubmit}>
        {/* Location Mode Selector */}
        <div className="recommendation-form-group" style={{ gridColumn: "span 2" }}>
          <label>{t.locationMode}</label>
          <select
            value={locationMode}
            onChange={(e) => setLocationMode(e.target.value)}
          >
            <option value="gps">📡 {t.useGps}</option>
            <option value="manual">✏️ {t.enterLatLon}</option>
            <option value="address">🏠 {t.enterAddress}</option>
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
              📍 {t.detectLocation}
            </button>
            <button
              type="button"
              className="recommendation-openmaps-btn"
              onClick={openInGoogleMaps}
              style={{ marginTop: 8 }}
            >
              🗺️ {t.openInMaps}
            </button>
            <div className="recommendation-location-info">{locationStatus}</div>
            {locationAccuracy && (
              <div className="recommendation-location-accuracy">
                {t.accuracy} ~{locationAccuracy} m
              </div>
            )}
          </div>
        )}

        {/* Manual Lat/Lon Mode */}
        {locationMode === "manual" && (
          <>
            <div className="recommendation-form-group">
              <label>{t.latitude}</label>
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
              <label>{t.longitude}</label>
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
                🗺️ {t.openInMaps}
              </button>
            </div>
          </>
        )}

        {/* Address Mode */}
        {locationMode === "address" && (
          <div className="recommendation-form-group" style={{ gridColumn: "span 2" }}>
            <label>{t.state}</label>
            <input
              type="text"
              name="state"
              value={addressData.state}
              onChange={handleAddressChange}
              required
            />
            <label>{t.district}</label>
            <input
              type="text"
              name="district"
              value={addressData.district}
              onChange={handleAddressChange}
              required
            />
            <label>{t.pincode}</label>
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
              🔍 {t.getCoordinates}
            </button>
            <button
              type="button"
              className="recommendation-openmaps-btn"
              style={{ marginTop: 10 }}
              onClick={openInGoogleMaps}
            >
              🗺️ {t.openInMaps}
            </button>
            <div className="recommendation-location-info">{locationStatus}</div>
          </div>
        )}

        {/* Area Type */}
        <div className="recommendation-form-group">
          <label>{t.areaType}</label>
          <select
            name="areaType"
            value={formData.areaType}
            onChange={handleChange}
          >
            <option value="Plain">{t.plain}</option>
            <option value="Mountain">{t.mountain}</option>
            <option value="Plateau">{t.plateau}</option>
          </select>
        </div>

        {/* Soil Type */}
        <div className="recommendation-form-group">
          <label>{t.soilType}</label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            required
          >
            <option value="">{t.selectSoil}</option>
            <option value="Red">{t.redSoil}</option>
            <option value="Laterite">{t.lateriteSoil}</option>
            <option value="Sandy">{t.sandySoil}</option>
            <option value="Loamy">{t.loamySoil}</option>
            <option value="Clay">{t.claySoil}</option>
            <option value="Alluvial">{t.alluvialSoil}</option>
          </select>
        </div>

        {/* Water Sources */}
        <div className="recommendation-form-group">
          <label>{t.waterSources}</label>
          <div className="recommendation-checkbox-group">
            {["Rainfed", "Canal", "Borewell", "River", "Pond"].map((src) => (
              <label key={src}>
                <input
                  type="checkbox"
                  value={src}
                  checked={formData.waterSources.includes(src)}
                  onChange={handleChange}
                />
                {t[src.toLowerCase()]}
              </label>
            ))}
          </div>
        </div>

        {/* Previous Crop */}
        <div className="recommendation-form-group">
          <label>{t.previousCrop}</label>
          <input
            type="text"
            name="previousCrop"
            placeholder={t.previousCropPlaceholder}
            value={formData.previousCrop}
            onChange={handleChange}
          />
          <label>{t.harvestedDate}</label>
          <input
            type="date"
            name="harvestedDate"
            value={formData.harvestedDate}
            onChange={handleChange}
          />
        </div>

        {/* Expected Seeding */}
        <div className="recommendation-form-group">
          <label>{t.expectedSeeding}</label>
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
          <label>{t.landAcres}</label>
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
          <label>{t.croppingType}</label>
          <select
            name="croppingType"
            value={formData.croppingType}
            onChange={handleChange}
          >
            <option value="Short-term">{t.shortTerm}</option>
            <option value="Long-term">{t.longTerm}</option>
            <option value="Mixed">{t.mixed}</option>
          </select>
        </div>

        {/* Crop Category */}
        <div className="recommendation-form-group">
          <label>{t.cropCategory}</label>
          <select
            name="cropCategory"
            value={formData.cropCategory}
            onChange={handleChange}
            required
          >
            <option value="">{t.selectCategory}</option>
            <option value="Vegetables">{t.vegetables}</option>
            <option value="Fruits">{t.fruits}</option>
            <option value="Pulses">{t.pulses}</option>
            <option value="Cereals">{t.cereals}</option>
            <option value="Oilseeds">{t.oilseeds}</option>
            <option value="Cash Crops">{t.cashCrops}</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="recommendation-submit-btn"
          disabled={loading}
        >
          {loading ? t.processing : t.getRecommendation}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="recommendation-result">
          <h3 className="recommendation-result-title">
            🌾 {t.recommendedCrop}: {result.recommendedCrop}
          </h3>
          <p>
            {t.duration}: {result.cropDurationDays} {t.days}
          </p>

          <div className="recommendation-growth-stages">
            <h4>{t.growthStages}</h4>
            <ul>
              {result.growthStages.map((stage, idx) => (
                <li key={idx}>{stage}</li>
              ))}
            </ul>
          </div>

          <div className="recommendation-investment-card">
            <h4>💰 {t.investmentProfit}</h4>
            <p>{t.investment}: ₹{result.investment}</p>
            <p>{t.profit}: ₹{result.profit}</p>
            <p>{t.roi}: {result.roi}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
