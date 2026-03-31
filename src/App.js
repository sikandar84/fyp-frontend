// import React, { useState } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [file, setFile] = useState(null);
//   const [weight, setWeight] = useState(100)
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

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [disease, setDisease] = useState("");
  const [goal, setGoal] = useState("maintain");

  const [recommendation, setRecommendation] = useState("");
  const [recLoading, setRecLoading] = useState(false);

  // -------------------------
  // Predict
  // -------------------------
  const handlePredict = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weight", Number(weight)); // FIX

    setLoading(true);
    setResult(null);
    setRecommendation("");

    try {
      const response = await axios.post(
        "https://fyp-backend-production-82be.up.railway.app/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("PREDICT ERROR:", error.response?.data || error.message);
      alert("Error calling backend (predict)");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Recommendation
  // -------------------------
  const getRecommendation = async () => {
    if (!result) {
      alert("Predict food first");
      return;
    }

    const formData = new FormData();

    // FIX: convert everything to NUMBER
    formData.append("calories", Number(result.calories || 0));
    formData.append("protein", Number(result.protein || 0));
    formData.append("carbohydrates", Number(result.carbohydrates || 0));
    formData.append("fats", Number(result.fats || 0));
    formData.append("fiber", Number(result.fiber || 0));
    formData.append("sugars", Number(result.sugars || 0));
    formData.append("sodium", Number(result.sodium || 0));

    formData.append("age", Number(age || 0));
    formData.append("gender", gender || "Unknown");

    // FIX: map frontend goal → backend goal
    let mappedGoal = "maintain";
    if (goal === "weight loss") mappedGoal = "weight_loss";
    if (goal === "muscle gain") mappedGoal = "weight_gain";

    formData.append("goal", mappedGoal);
    formData.append("disease", disease || "");

    setRecLoading(true);
    setRecommendation("");

    try {
      const response = await axios.post(
        "https://fyp-backend-production-82be.up.railway.app/recommend",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("RESPONSE:", response.data);

      const rec = response.data?.recommendations?.[0];

      setRecommendation(rec || "No AI response received.");
    } catch (error) {
      console.error("RECOMMEND ERROR:", error.response?.data || error.message);
      alert("Error getting recommendation");
    } finally {
      setRecLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🍽️ Nutrition Detector</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>

      {result && (
        <div>
          <h3>{result.label}</h3>

          <p>Calories: {result.calories}</p>
          <p>Protein: {result.protein}</p>
          <p>Carbs: {result.carbohydrates}</p>
          <p>Fats: {result.fats}</p>

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="maintain">Maintain</option>
            <option value="weight loss">Weight Loss</option>
            <option value="muscle gain">Muscle Gain</option>
          </select>

          <input
            type="text"
            placeholder="Disease"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />

          <button onClick={getRecommendation} disabled={recLoading}>
            {recLoading ? "Analyzing..." : "Get Recommendation"}
          </button>

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
