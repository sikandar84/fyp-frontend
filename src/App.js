import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://fyp-backend-production-82be.up.railway.app";

function App() {
  const [file, setFile] = useState(null);
  const [weight, setWeight] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [disease, setDisease] = useState("");

  const [recommendation, setRecommendation] = useState("");
  const [recLoading, setRecLoading] = useState(false);

  // -------------------------
  // Predict
  // -------------------------
  const handlePredict = async () => {
    if (!file) {
      alert("Select image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weight", Number(weight));

    setLoading(true);
    setResult(null);
    setRecommendation("");

    try {
      const res = await axios.post(`${API}/predict`, formData);

      console.log("PREDICT:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("PREDICT ERROR:", err.response?.data || err);
      alert("Error calling /predict");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Recommendation
  // -------------------------
  const getRecommendation = async () => {
    if (!result) {
      alert("Predict first");
      return;
    }

    const formData = new FormData();

    // ✅ REQUIRED NUMBERS
    formData.append("calories", Number(result.calories || 0));
    formData.append("protein", Number(result.protein || 0));
    formData.append("carbohydrates", Number(result.carbohydrates || 0));
    formData.append("fats", Number(result.fats || 0));
    formData.append("fiber", Number(result.fiber || 0));
    formData.append("sugars", Number(result.sugars || 0));
    formData.append("sodium", Number(result.sodium || 0));

    // ✅ REQUIRED USER DATA (MATCH BACKEND)
    formData.append("age", parseInt(age) || 0);
    formData.append("gender", gender || "Unknown");
    formData.append("goal", goal || "maintain");
    formData.append("disease", disease || "");

    setRecLoading(true);
    setRecommendation("");

    try {
      const res = await axios.post(`${API}/recommend`, formData);

      console.log("RECOMMEND:", res.data);

      setRecommendation(
        res.data?.recommendations?.[0] || "No AI response"
      );
    } catch (err) {
      console.error("RECOMMEND ERROR:", err.response?.data || err);
      alert("Error calling /recommend");
    } finally {
      setRecLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🍽️ Nutrition Detector</h1>

      {/* FILE + WEIGHT */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (g)"
        />

        <button onClick={handlePredict} disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div>
          <h2>{result.label}</h2>

          <p>Calories: {result.calories}</p>
          <p>Protein: {result.protein}</p>
          <p>Carbs: {result.carbohydrates}</p>
          <p>Fats: {result.fats}</p>
          <p>Fiber: {result.fiber}</p>
          <p>Sugars: {result.sugars}</p>
          <p>Sodium: {result.sodium}</p>

          {/* USER INPUT */}
          <h3>Personal Info</h3>

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="maintain">Maintain</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
          </select>

          <input
            type="text"
            placeholder="Disease (optional)"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />

          <button onClick={getRecommendation} disabled={recLoading}>
            {recLoading ? "Analyzing..." : "Get Recommendation"}
          </button>

          {/* AI OUTPUT */}
          {recommendation && (
            <div>
              <h3>AI Recommendation</h3>
              <p>{recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
