// import React, { useState } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [file, setFile] = useState(null);
//   const [weight, setWeight] = useState(100);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [age, setAge] = useState("");
// const [gender, setGender] = useState("");
// const [disease, setDisease] = useState("");
// const [recommendation, setRecommendation] = useState("");

//   const handlePredict = async () => {
//     if (!file) {
//       alert("Please select an image");
//       return;
//     }

//     const formData = new FormData(); // Always create new FormData
//     formData.append("file", file);
//     formData.append("weight", weight);

//     setLoading(true);
//     setResult(null);

//     try {
//       const response = await axios.post(
//         "https://fyp-backend-production-82be.up.railway.app/predict",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setResult(response.data);

//       // Reset file input
//       setFile(null);
//       document.getElementById("fileInput").value = "";
//     } catch (error) {
//       console.error(error);
//       alert("Error calling backend");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app">
//       <h1 className="title">🍽️ Nutrition Detector</h1>

//       <div className="input-container">
//         <input
//           id="fileInput"
//           type="file"
//           accept="image/*"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <input
//           type="number"
//           min="1"
//           value={weight}
//           onChange={(e) => setWeight(e.target.value)}
//           placeholder="Weight (g)"
//         />
//         <button onClick={handlePredict} disabled={loading}>
//           {loading ? "Predicting..." : "Predict"}
//         </button>
//       </div>

//       {result && (
//         <div className="result-card">
//           <h2>Prediction Result</h2>
//           <p className="food-label">{result.label.toUpperCase()}</p>
//           <div className="confidence">
//             <span>Confidence:</span>
//             <div className="bar-container">
//               <div
//                 className="bar"
//                 style={{ width: `${(result.confidence || 0) * 100}%` }}
//               ></div>
//             </div>
//             <span>{((result.confidence || 0) * 100).toFixed(1)}%</span>
//           </div>

//           <h3>Nutrition (for {result.weight} g)</h3>
//           <ul className="nutrition-list">
//             <li>Calories: {result.calories}</li>
//             <li>Protein: {result.protein} g</li>
//             <li>Carbohydrates: {result.carbohydrates} g</li>
//             <li>Fats: {result.fats} g</li>
//             <li>Fiber: {result.fiber} g</li>
//             <li>Sugars: {result.sugars} g</li>
//             <li>Sodium: {result.sodium} mg</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;




// // App.js



import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [weight, setWeight] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [disease, setDisease] = useState("");
  const [goal, setGoal] = useState("maintain");

  const [recommendation, setRecommendation] = useState("");
  const [recLoading, setRecLoading] = useState(false);

  // -------------------------
  // Predict Food
  // -------------------------
  const handlePredict = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weight", weight);

    setLoading(true);
    setResult(null);
    setRecommendation("");

    try {
      const response = await axios.post(
        "https://fyp-backend-production-82be.up.railway.app/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(response.data);

      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error(error);
      alert("Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // 🔥 Get Recommendation
  // -------------------------
  const getRecommendation = async () => {
    if (!result) {
      alert("Predict food first");
      return;
    }

    const formData = new FormData();

    // nutrients
    formData.append("calories", result.calories);
    formData.append("protein", result.protein);
    formData.append("carbohydrates", result.carbohydrates);
    formData.append("fats", result.fats);
    formData.append("fiber", result.fiber);
    formData.append("sugars", result.sugars);
    formData.append("sodium", result.sodium);

    // user data
    formData.append("goal", goal);
    formData.append("disease", disease || "");

    setRecLoading(true);
    setRecommendation("");

    try {
      const response = await axios.post(
        "https://fyp-backend-production-82be.up.railway.app/recommend",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setRecommendation(response.data.recommendations[0]);
    } catch (err) {
      console.error(err);
      alert("Error getting recommendation");
    } finally {
      setRecLoading(false);
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

      {/* RESULT */}
      {result && (
        <div className="result-card">
          <h2>Prediction Result</h2>
          <p className="food-label">{result.label.toUpperCase()}</p>

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

          {/* 🔥 USER INPUT */}
          <div className="user-inputs">
            <h3>Personal Info</h3>

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="maintain">Maintain</option>
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
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
          </div>

          {/* 🔥 AI OUTPUT */}
          {recommendation && (
            <div className="recommendation-box">
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
