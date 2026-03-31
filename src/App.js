import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://fyp-backend-production-82be.up.railway.app"; // 🔥 CHANGE THIS

function App() {
  const [file, setFile] = useState(null);
  const [weight, setWeight] = useState(100);

  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [disease, setDisease] = useState("");

  const [recommendation, setRecommendation] = useState("");

  // -------------------------
  // Handle Image Upload
  // -------------------------
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // -------------------------
  // Predict Nutrition
  // -------------------------
  const handlePredict = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weight", weight);

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/predict`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNutrition(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Prediction failed");
      setLoading(false);
    }
  };

  // -------------------------
  // Get AI Recommendation
  // -------------------------
  const handleRecommend = async () => {
    if (!nutrition) return;

    const formData = new FormData();

    formData.append("calories", nutrition.calories);
    formData.append("protein", nutrition.protein);
    formData.append("carbohydrates", nutrition.carbohydrates);
    formData.append("fats", nutrition.fats);
    formData.append("fiber", nutrition.fiber);
    formData.append("sugars", nutrition.sugars);
    formData.append("sodium", nutrition.sodium);

    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("goal", goal);
    formData.append("disease", disease);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/recommend`,
        formData
      );

      setRecommendation(res.data.recommendations[0]);
    } catch (err) {
      console.error(err);
      alert("Recommendation failed");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🍎 Nutrition AI App</h1>

      {/* ---------------- Upload Section ---------------- */}
      <div>
        <h3>Upload Food Image</h3>

        <input type="file" onChange={handleFileChange} />
        <br /><br />

        <input
          type="number"
          placeholder="Weight (grams)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <br /><br />

        <button onClick={handlePredict}>
          {loading ? "Processing..." : "Predict Nutrition"}
        </button>
      </div>

      {/* ---------------- Nutrition Result ---------------- */}
      {nutrition && (
        <div style={{ marginTop: 20 }}>
          <h3>📊 Nutrition Result</h3>
          <p><b>Food:</b> {nutrition.label}</p>
          <p><b>Calories:</b> {nutrition.calories}</p>
          <p><b>Protein:</b> {nutrition.protein}</p>
          <p><b>Carbs:</b> {nutrition.carbohydrates}</p>
          <p><b>Fats:</b> {nutrition.fats}</p>
          <p><b>Fiber:</b> {nutrition.fiber}</p>
          <p><b>Sugars:</b> {nutrition.sugars}</p>
          <p><b>Sodium:</b> {nutrition.sodium}</p>
        </div>
      )}

      {/* ---------------- User Inputs ---------------- */}
      {nutrition && (
        <div style={{ marginTop: 20 }}>
          <h3>👤 Your Details</h3>

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <br /><br />

          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <br /><br />

          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="maintain">Maintain Weight</option>
            <option value="loss">Lose Weight</option>
            <option value="gain">Gain Weight</option>
          </select>

          <br /><br />

          <input
            type="text"
            placeholder="Disease (optional)"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />

          <br /><br />

          <button onClick={handleRecommend}>
            Get AI Recommendation
          </button>
        </div>
      )}

      {/* ---------------- Recommendation ---------------- */}
      {recommendation && (
        <div style={{ marginTop: 20 }}>
          <h3>🤖 AI Recommendation</h3>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default App;
