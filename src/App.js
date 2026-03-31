// import React, { useState } from "react";
// import axios from "axios";
// import "./App.css";

// function App() {
//   const [file, setFile] = useState(null);
//   const [weight, setWeight] = useState(100);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");
//   const [disease, setDisease] = useState("");
//   const [goal, setGoal] = useState("maintain");

//   const [recommendation, setRecommendation] = useState("");
//   const [recLoading, setRecLoading] = useState(false);

//   // -------------------------
//   // Predict Food
//   // -------------------------
//   const handlePredict = async () => {
//     if (!file) {
//       alert("Please select an image");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("weight", weight);

//     setLoading(true);
//     setResult(null);
//     setRecommendation("");

//     try {
//       const response = await axios.post(
//         "https://fyp-backend-production-82be.up.railway.app/predict",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       setResult(response.data);

//       setFile(null);
//       document.getElementById("fileInput").value = "";
//     } catch (error) {
//       console.error(error);
//       alert("Error calling backend");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------
//   // Get Recommendation
//   // -------------------------
//   const getRecommendation = async () => {
//     if (!result) {
//       alert("Predict food first");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("calories", result.calories || 0);
//     formData.append("protein", result.protein || 0);
//     formData.append("carbohydrates", result.carbohydrates || 0);
//     formData.append("fats", result.fats || 0);
//     formData.append("fiber", result.fiber || 0);
//     formData.append("sugars", result.sugars || 0);
//     formData.append("sodium", result.sodium || 0);

//     formData.append("age", age || 0);
//     formData.append("gender", gender || "Unknown");
//     formData.append("goal", goal || "maintain");
//     formData.append("disease", disease || "");

//     setRecLoading(true);
//     setRecommendation("");

//     try {
//       const response = await axios.post(
//         "https://fyp-backend-production-82be.up.railway.app/recommend",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       const rec = response.data?.recommendations?.[0];

//       if (rec) {
//         setRecommendation(rec);
//       } else {
//         setRecommendation("No AI response received.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error getting recommendation");
//     } finally {
//       setRecLoading(false);
//     }
//   };

//   return (
//     <div className="app">
//       <h1 className="title">🍽️ Nutrition Detector</h1>

//       {/* INPUT SECTION */}
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

//       {/* RESULT */}
//       {result && (
//         <div className="result-card">
//           <h2>Prediction Result</h2>

//           <p className="food-label">
//             {result.label ? result.label.toUpperCase() : ""}
//           </p>

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

//           {/* USER INPUT */}
//           <div className="user-inputs">
//             <h3>Personal Info</h3>

//             <input
//               type="number"
//               placeholder="Age"
//               value={age}
//               onChange={(e) => setAge(e.target.value)}
//             />

//             <select value={gender} onChange={(e) => setGender(e.target.value)}>
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>

//             <select value={goal} onChange={(e) => setGoal(e.target.value)}>
//               <option value="maintain">Maintain</option>
//               <option value="weight loss">Weight Loss</option>
//               <option value="muscle gain">Muscle Gain</option>
//             </select>

//             <input
//               type="text"
//               placeholder="Disease (optional)"
//               value={disease}
//               onChange={(e) => setDisease(e.target.value)}
//             />

//             <button onClick={getRecommendation} disabled={recLoading}>
//               {recLoading ? "Analyzing..." : "Get Recommendation"}
//             </button>
//           </div>

//           {/* AI OUTPUT */}
//           {recommendation && (
//             <div className="recommendation-box">
//               <h3>AI Recommendation</h3>
//               <p>{recommendation}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;



import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [weight, setWeight] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://fyp-backend-production-82be.up.railway.app";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePredict = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("weight", weight);

      const res = await axios.post(`${BASE_URL}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("BACKEND RESPONSE:", res.data);

      setResult(res.data);

    } catch (err) {
      console.log("ERROR:", err);
      setResult({
        error: err?.response?.data?.error || "Backend error"
      });
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>

      <h1>🍎 Food Nutrition AI</h1>

      {/* Upload */}
      <input type="file" onChange={handleFileChange} />

      {/* Weight */}
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Enter weight"
      />

      {/* Button */}
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>

      {/* ERROR */}
      {result?.error && (
        <div style={{ color: "red", marginTop: 20 }}>
          <h3>Error</h3>
          <p>{result.error}</p>
        </div>
      )}

      {/* RESULT */}
      {result && !result.error && (
  <div style={{ marginTop: 20 }}>

    <h2>Prediction Result</h2>

    <h3>🍽️ {result?.label || "Unknown Food"}</h3>

    <p>Calories: {result?.calories ?? 0}</p>
    <p>Protein: {result?.protein ?? 0} g</p>
    <p>Carbohydrates: {result?.carbohydrates ?? 0} g</p>
    <p>Fats: {result?.fats ?? 0} g</p>
    <p>Fiber: {result?.fiber ?? 0} g</p>
    <p>Sugars: {result?.sugars ?? 0} g</p>
    <p>Sodium: {result?.sodium ?? 0} mg</p>

  </div>
)}

    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    fontFamily: "Arial",
    textAlign: "center"
  },
  card: {
    marginTop: 20,
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 10,
    display: "inline-block",
    textAlign: "left"
  }
};

export default App;
