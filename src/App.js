import React, { useState } from "react";
import axios from "axios";
import "./App.css";

// ⚠️ CHANGE THIS IF BACKEND URL CHANGES
const BASE_URL = "https://fyp-backend-production-82be.up.railway.app";

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
  // PREDICT
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
      const res = await axios.post(`${BASE_URL}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Predict response:", res.data);
      setResult(res.data);

    } catch (err) {
      console.error("❌ Predict error:", err?.response?.data || err.message);
      alert("Backend /predict failed. Check logs.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // RECOMMEND
  // -------------------------
  const getRecommendation = async () => {
    if (!result) {
      alert("Run prediction first");
      return;
    }

    const formData = new FormData();

    formData.append("calories", Number(result.calories || 0));
    formData.append("protein", Number(result.protein || 0));
    formData.append("carbohydrates", Number(result.carbohydrates || 0));
    formData.append("fats", Number(result.fats || 0));
    formData.append("fiber", Number(result.fiber || 0));
    formData.append("sugars", Number(result.sugars || 0));
    formData.append("sodium", Number(result.sodium || 0));

    formData.append("age", Number(age || 0));
    formData.append("gender", gender || "Unknown");
    formData.append("goal", goal || "maintain");
    formData.append("disease", disease || "");

    setRecLoading(true);
    setRecommendation("");

    try {
      const res = await axios.post(`${BASE_URL}/recommend`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("✅ Recommend:", res.data);

      const text = res.data?.recommendations?.[0];
      setRecommendation(text || "No AI response");

    } catch (err) {
      console.error("❌ Recommend error:", err?.response?.data || err.message);
      alert("Backend /recommend failed");
    } finally {
      setRecLoading(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="app">
      <h1>🍽️ Nutrition AI</h1>

      {/* INPUT */}
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

      {/* RESULT */}
      {result && (
        <div>
          <h2>Result</h2>

          <p><b>{result.label}</b></p>

          <p>Calories: {result.calories}</p>
          <p>Protein: {result.protein}</p>
          <p>Carbs: {result.carbohydrates}</p>
          <p>Fats: {result.fats}</p>
          <p>Fiber: {result.fiber}</p>
          <p>Sugar: {result.sugars}</p>
          <p>Sodium: {result.sodium}</p>

          {/* USER INPUT */}
          <h3>Personal Info</h3>

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <select onChange={(e) => setGender(e.target.value)} value={gender}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select onChange={(e) => setGoal(e.target.value)} value={goal}>
            <option value="maintain">Maintain</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
          </select>

          <input
            type="text"
            placeholder="Disease"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />

          <button onClick={getRecommendation} disabled={recLoading}>
            {recLoading ? "Loading..." : "Get Recommendation"}
          </button>

          {/* AI OUTPUT */}
          {recommendation && (
            <div>
              <h3>AI Advice</h3>
              <p>{recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
