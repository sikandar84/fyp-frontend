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
//         "https://fyp-backend-production-18ec.up.railway.app/predict",
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

function App() {
  const [file, setFile] = useState(null);
  const [weight, setWeight] = useState(100);
  const [nutritionResult, setNutritionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // User inputs for recommendation
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [disease, setDisease] = useState("");
  const [recommendations, setRecommendations] = useState(null);

  // -----------------------------
  // Step 1: Upload and predict nutrition
  // -----------------------------
  const handlePredictNutrition = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weight", weight);

    setLoading(true);
    setNutritionResult(null);
    setRecommendations(null); // clear previous recommendations

    try {
      const response = await axios.post(
        "https://fyp-backend-production-18ec.up.railway.app/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setNutritionResult(response.data);

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

  // -----------------------------
  // Step 2: Submit user details for recommendation
  // -----------------------------
  const handleGetRecommendation = async () => {
    if (!nutritionResult) return;

    const formData = new FormData();
    formData.append("file", new Blob()); // Dummy file since prediction done
    formData.append("weight", nutritionResult.weight);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("goal", goal);
    formData.append("disease", disease);

    setLoading(true);

    try {
      const response = await axios.post(
        "https://fyp-backend-production-18ec.up.railway.app/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error(error);
      alert("Error getting recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">🍽️ Nutrition & Recommendation System</h1>

      {/* Step 1: Upload food image */}
      {!nutritionResult && (
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
          <button onClick={handlePredictNutrition} disabled={loading}>
            {loading ? "Predicting..." : "Predict Nutrition"}
          </button>
        </div>
      )}

      {/* Step 2: Show nutrition result */}
      {nutritionResult && (
        <div className="result-card">
          <h2>Nutrition Result</h2>
          <p className="food-label">{nutritionResult.label.toUpperCase()}</p>
          <div className="confidence">
            <span>Confidence:</span>
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: `${(nutritionResult.confidence || 0) * 100}%` }}
              ></div>
            </div>
            <span>{((nutritionResult.confidence || 0) * 100).toFixed(1)}%</span>
          </div>

          <h3>Nutrition (for {nutritionResult.weight} g)</h3>
          <ul className="nutrition-list">
            <li>Calories: {nutritionResult.calories}</li>
            <li>Protein: {nutritionResult.protein} g</li>
            <li>Carbohydrates: {nutritionResult.carbohydrates} g</li>
            <li>Fats: {nutritionResult.fats} g</li>
            <li>Fiber: {nutritionResult.fiber} g</li>
            <li>Sugars: {nutritionResult.sugars} g</li>
            <li>Sodium: {nutritionResult.sodium} mg</li>
          </ul>

          {/* Step 3: User details for recommendation */}
          {!recommendations && (
            <div className="user-inputs">
              <h3>Enter your details for recommendations:</h3>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="maintain">Maintain Weight</option>
              </select>
              <select value={disease} onChange={(e) => setDisease(e.target.value)}>
                <option value="">No Disease</option>
                <option value="diabetes">Diabetes</option>
                <option value="hypertension">Hypertension</option>
              </select>
              <button onClick={handleGetRecommendation} disabled={loading}>
                {loading ? "Generating..." : "Get Recommendations"}
              </button>
            </div>
          )}

          {/* Step 4: Show recommendations */}
          {recommendations && (
            <div className="recommendation-card">
              <h3>Personalized Recommendations</h3>
              <ul>
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
