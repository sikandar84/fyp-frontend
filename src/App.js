// import React, { useState } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [file, setFile] = useState(null);
//   const [weight, setWeight] = useState(100);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

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
//         "https://fyp-backend-production-adce.up.railway.app/predict",
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


import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const BASE_URL = "https://fyp-backend-production-adce.up.railway.app";

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  // User details
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("male");
  const [goal, setGoal] = useState("weight_loss");

  // =====================
  // Step 1: Predict
  // =====================
  const handlePredict = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setPrediction(null);
    setRecommendation(null);

    try {
      const res = await axios.post(`${BASE_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPrediction(res.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // Step 2: Recommendation
  // =====================
  const handleRecommendation = async () => {
    if (!prediction) {
      alert("Please predict food first");
      return;
    }

    if (!age || !height || !weight) {
      alert("Please fill all user details");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/recommend`, {
        food_label: prediction.food_label,
        nutrition: prediction.nutrition,
        age: age,
        height: height,
        weight: weight,
        gender: gender,
        goal: goal,
      });

      setRecommendation(res.data);
    } catch (err) {
      console.error(err);
      alert("Recommendation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🍽️ Smart Nutrition & Diet System</h1>

      {/* Image Upload */}
      <div className="card">
        <h2>Step 1: Upload Food Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handlePredict} disabled={loading}>
          {loading ? "Processing..." : "Detect Food"}
        </button>
      </div>

      {/* Prediction Result */}
      {prediction && (
        <div className="card">
          <h2>Detected Food</h2>
          <p className="food">{prediction.food_label}</p>
          <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>

          <h3>Nutrition</h3>
          <ul>
            <li>Calories: {prediction.nutrition.calories}</li>
            <li>Protein: {prediction.nutrition.protein} g</li>
            <li>Fat: {prediction.nutrition.fat} g</li>
          </ul>
        </div>
      )}

      {/* User Inputs */}
      {prediction && (
        <div className="card">
          <h2>Step 2: Enter Your Details</h2>

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintain">Maintain</option>
          </select>

          <button onClick={handleRecommendation} disabled={loading}>
            {loading ? "Generating..." : "Get Recommendation"}
          </button>
        </div>
      )}

      {/* Recommendation Result */}
      {recommendation && (
        <div className="card result">
          <h2>Diet Recommendation</h2>
          <p>
            Daily Calories Target:{" "}
            <b>{recommendation.daily_calories_target}</b>
          </p>
          <p>{recommendation.advice}</p>
        </div>
      )}
    </div>
  );
}

export default App;
