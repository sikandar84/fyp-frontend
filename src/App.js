import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [weight, setWeight] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData(); // Always create new FormData
    formData.append("file", file);
    formData.append("weight", weight);

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "https://fyp-backend-production-adce.up.railway.app/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(response.data);

      // Reset file input
      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error(error);
      alert("Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🍽️ Nutrition Detector</h1>

      <div className="input-container">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="number"
          min="1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (g)"
        />
        <button onClick={handlePredict} disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {result && (
        <div className="result-card">
          <h2>Prediction Result</h2>
          <p className="food-label">{result.label.toUpperCase()}</p>
          <div className="confidence">
            <span>Confidence:</span>
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: `${(result.confidence || 0) * 100}%` }}
              ></div>
            </div>
            <span>{((result.confidence || 0) * 100).toFixed(1)}%</span>
          </div>

          <h3>Nutrition (for {result.weight} g)</h3>
          <ul className="nutrition-list">
            <li>Calories: {result.calories}</li>
            <li>Protein: {result.protein} g</li>
            <li>Carbohydrates: {result.carbohydrates} g</li>
            <li>Fats: {result.fats} g</li>
            <li>Fiber: {result.fiber} g</li>
            <li>Sugars: {result.sugars} g</li>
            <li>Sodium: {result.sodium} mg</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
