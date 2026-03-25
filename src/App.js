// // import React, { useState } from "react";
// // import axios from "axios";
// // import "./App.css";

// // function App() {
// //   const [file, setFile] = useState(null);
// //   const [weight, setWeight] = useState(100);
// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handlePredict = async () => {
// //     if (!file) {
// //       alert("Please select an image");
// //       return;
// //     }

// //     const formData = new FormData(); // Always create new FormData
// //     formData.append("file", file);
// //     formData.append("weight", weight);

// //     setLoading(true);
// //     setResult(null);

// //     try {
// //       const response = await axios.post(
// //         "https://fyp-backend-production-18ec.up.railway.app/predict",
// //         formData,
// //         { headers: { "Content-Type": "multipart/form-data" } }
// //       );

// //       setResult(response.data);

// //       // Reset file input
// //       setFile(null);
// //       document.getElementById("fileInput").value = "";
// //     } catch (error) {
// //       console.error(error);
// //       alert("Error calling backend");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="app">
// //       <h1 className="title">🍽️ Nutrition Detector</h1>

// //       <div className="input-container">
// //         <input
// //           id="fileInput"
// //           type="file"
// //           accept="image/*"
// //           onChange={(e) => setFile(e.target.files[0])}
// //         />
// //         <input
// //           type="number"
// //           min="1"
// //           value={weight}
// //           onChange={(e) => setWeight(e.target.value)}
// //           placeholder="Weight (g)"
// //         />
// //         <button onClick={handlePredict} disabled={loading}>
// //           {loading ? "Predicting..." : "Predict"}
// //         </button>
// //       </div>

// //       {result && (
// //         <div className="result-card">
// //           <h2>Prediction Result</h2>
// //           <p className="food-label">{result.label.toUpperCase()}</p>
// //           <div className="confidence">
// //             <span>Confidence:</span>
// //             <div className="bar-container">
// //               <div
// //                 className="bar"
// //                 style={{ width: `${(result.confidence || 0) * 100}%` }}
// //               ></div>
// //             </div>
// //             <span>{((result.confidence || 0) * 100).toFixed(1)}%</span>
// //           </div>

// //           <h3>Nutrition (for {result.weight} g)</h3>
// //           <ul className="nutrition-list">
// //             <li>Calories: {result.calories}</li>
// //             <li>Protein: {result.protein} g</li>
// //             <li>Carbohydrates: {result.carbohydrates} g</li>
// //             <li>Fats: {result.fats} g</li>
// //             <li>Fiber: {result.fiber} g</li>
// //             <li>Sugars: {result.sugars} g</li>
// //             <li>Sodium: {result.sodium} mg</li>
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [weight, setWeight] = useState(100);
//   const [nutrition, setNutrition] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [recLoading, setRecLoading] = useState(false);

//   const [userInputs, setUserInputs] = useState({
//     age: "",
//     gender: "",
//     goal: "maintain",
//     disease: "",
//   });

//   const [recommendation, setRecommendation] = useState(null);

//   // Handle image preview
//   useEffect(() => {
//     if (!file) {
//       setPreview(null);
//       return;
//     }
//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);
//     return () => URL.revokeObjectURL(objectUrl);
//   }, [file]);

//   // Step 1: Upload & predict nutrition
//   const handlePredict = async () => {
//     if (!file) return alert("Please select an image");

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("weight", weight);

//     setLoading(true);
//     setNutrition(null);
//     setRecommendation(null);

//     try {
//       const response = await axios.post(
//         "https://fyp-backend-production-18ec.up.railway.app/predict",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       setNutrition(response.data);
//     } catch (err) {
//       console.error(err);
//       alert("Error predicting nutrition. Please check the backend connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2: Get recommendation
//   const handleRecommendation = async () => {
//     if (!nutrition) return;

//     const formData = new FormData();
//     // Append all nutrition facts to the recommendation request
//     Object.entries(nutrition).forEach(([k, v]) => formData.append(k, v || 0));
//     formData.append("goal", userInputs.goal);
//     formData.append("disease", userInputs.disease);

//     setRecLoading(true);
//     try {
//       const response = await axios.post(
//         "https://fyp-backend-production-18ec.up.railway.app/recommend",
//         formData
//       );
//       setRecommendation(response.data.recommendations);
//     } catch (err) {
//       console.error(err);
//       alert("Error getting recommendation");
//     } finally {
//       setRecLoading(false);
//     }
//   };

//   return (
//     <div className="app">
//       <h1 className="title">🍽️ NutriSmart AI</h1>

//       <div className="input-container">
//         <label className="file-input-label">
//           {preview ? (
//             <img src={preview} alt="Preview" className="image-preview" />
//           ) : (
//             <div className="upload-placeholder">📸 Click to upload food image</div>
//           )}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files[0])}
//             style={{ display: "none" }}
//           />
//         </label>

//         <div className="weight-input">
//           <label>Portion Weight (grams):</label>
//           <input
//             type="number"
//             min="1"
//             value={weight}
//             onChange={(e) => setWeight(e.target.value)}
//             placeholder="e.g. 150"
//           />
//         </div>

//         <button onClick={handlePredict} disabled={loading}>
//           {loading ? "Analyzing Food..." : "Predict Nutrition"}
//         </button>
//       </div>

//       {nutrition && (
//         <div className="result-card">
//           <h2>📊 Nutrition Analysis</h2>
//           <ul className="nutrition-list">
//             <li>🔥 Calories: {nutrition.calories}</li>
//             <li>💪 Protein: {nutrition.protein}g</li>
//             <li>🍞 Carbs: {nutrition.carbohydrates}g</li>
//             <li>🥑 Fats: {nutrition.fats}g</li>
//             <li>🌾 Fiber: {nutrition.fiber}g</li>
//             <li>🍭 Sugars: {nutrition.sugars}g</li>
//             <li>🧂 Sodium: {nutrition.sodium}mg</li>
//           </ul>

//           <div className="user-details-form">
//             <h3>🎯 Personalized Insights</h3>
//             <div className="input-grid">
//               <input
//                 type="number"
//                 placeholder="Your Age"
//                 value={userInputs.age}
//                 onChange={(e) => setUserInputs({ ...userInputs, age: e.target.value })}
//               />
//               <select
//                 value={userInputs.gender}
//                 onChange={(e) => setUserInputs({ ...userInputs, gender: e.target.value })}
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//               </select>
//             </div>

//             <select
//               value={userInputs.goal}
//               onChange={(e) => setUserInputs({ ...userInputs, goal: e.target.value })}
//             >
//               <option value="maintain">Maintain Weight</option>
//               <option value="weight_loss">Weight Loss</option>
//               <option value="weight_gain">Weight Gain</option>
//             </select>

//             <input
//               type="text"
//               placeholder="Conditions (e.g. diabetes, hypertension)"
//               value={userInputs.disease}
//               onChange={(e) => setUserInputs({ ...userInputs, disease: e.target.value })}
//             />
            
//             <button className="rec-btn" onClick={handleRecommendation} disabled={recLoading}>
//               {recLoading ? "Generating Tips..." : "Get Health Recommendation"}
//             </button>
//           </div>
//         </div>
//       )}

//       {recommendation && (
//         <div className="result-card recommendation-section">
//           <h2>💡 Recommendations</h2>
//           <ul className="rec-list">
//             {recommendation.map((rec, idx) => (
//               <li key={idx}>{rec}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [weight, setWeight] = useState(100);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userInputs, setUserInputs] = useState({
    age: "",
    gender: "",
    goal: "maintain",
    disease: "",
  });

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // 🔹 Predict + Recommend in one call
  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weight", weight);
    formData.append("goal", userInputs.goal);
    formData.append("disease", userInputs.disease);

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        "https://fyp-backend-production-82be.up.railway.app/analyze",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🍽️ NutriSmart AI</h1>

      <div className="input-container">
        <label className="file-input-label">
          {preview ? (
            <img src={preview} alt="Preview" className="image-preview" />
          ) : (
            <div className="upload-placeholder">
              📸 Click to upload food image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
        </label>

        <div className="weight-input">
          <label>Portion Weight (grams):</label>
          <input
            type="number"
            min="1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        {/* User inputs */}
        <div className="user-details-form">
          <h3>🎯 Personalized Insights</h3>
          <div className="input-grid">
            <input
              type="number"
              placeholder="Age"
              value={userInputs.age}
              onChange={(e) =>
                setUserInputs({ ...userInputs, age: e.target.value })
              }
            />
            <select
              value={userInputs.gender}
              onChange={(e) =>
                setUserInputs({ ...userInputs, gender: e.target.value })
              }
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <select
            value={userInputs.goal}
            onChange={(e) =>
              setUserInputs({ ...userInputs, goal: e.target.value })
            }
          >
            <option value="maintain">Maintain</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
          </select>

          <input
            type="text"
            placeholder="Disease (e.g. diabetes)"
            value={userInputs.disease}
            onChange={(e) =>
              setUserInputs({ ...userInputs, disease: e.target.value })
            }
          />
        </div>

        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze & Recommend"}
        </button>
      </div>

      {result && (
        <>
          <div className="result-card">
            <h2>📊 Nutrition Analysis</h2>
            <ul className="nutrition-list">
              <li>🔥 Calories: {result.nutrition.calories}</li>
              <li>💪 Protein: {result.nutrition.protein}g</li>
              <li>🍞 Carbs: {result.nutrition.carbohydrates}g</li>
              <li>🥑 Fats: {result.nutrition.fats}g</li>
              <li>🌾 Fiber: {result.nutrition.fiber}g</li>
              <li>🍭 Sugars: {result.nutrition.sugars}g</li>
              <li>🧂 Sodium: {result.nutrition.sodium}mg</li>
            </ul>
          </div>

          <div className="result-card">
            <h2>💡 AI Recommendation</h2>
            {result.recommendation
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, i) => (
                <p key={i}>{line}</p>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
