// import React, { useState } from "react";
// import axios from "axios";
// import "./App.css";

// const BASE_URL = "https://fyp-backend-production-82be.up.railway.app";

// function App() {
//   const [file, setFile] = useState(null);
//   const [weight, setWeight] = useState(100);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");
//   const [goal, setGoal] = useState("maintain");
//   const [disease, setDisease] = useState("");

//   const [aiResponse, setAiResponse] = useState("");

//   // -------------------------
//   // PREDICT
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
//     setAiResponse("");

//     try {
//       const response = await axios.post(`${BASE_URL}/predict`, formData);

//       console.log("Prediction:", response.data);

//       // 🔥 HANDLE BACKEND ERROR
//       if (response.data.error) {
//         alert(response.data.error);
//         return;
//       }

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
//   // RECOMMEND
//   // -------------------------
//   const handleRecommend = async () => {
//     if (!result) return;

//     const formData = new FormData();

//     formData.append("calories", result.calories);
//     formData.append("protein", result.protein);
//     formData.append("carbohydrates", result.carbohydrates);
//     formData.append("fats", result.fats);
//     formData.append("fiber", result.fiber);
//     formData.append("sugars", result.sugars);
//     formData.append("sodium", result.sodium);

//     formData.append("age", age);
//     formData.append("gender", gender);
//     formData.append("goal", goal);
//     formData.append("disease", disease);

//     try {
//       const res = await axios.post(`${BASE_URL}/recommend`, formData);

//       console.log("AI:", res.data);

//       setAiResponse(res.data.recommendations[0]);

//     } catch (error) {
//       console.error(error);
//       alert("AI failed");
//     }
//   };

//   return (
//     <div className="app">
//       <h1 className="title">🍽️ Nutrition Detector</h1>

//       {/* INPUT */}
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
//             {result.label ? result.label.toUpperCase() : "UNKNOWN"}
//           </p>

//           <div className="confidence">
//             <span>Confidence:</span>

//             <div className="bar-container">
//               <div
//                 className="bar"
//                 style={{
//                   width: `${(result.confidence || 0) * 100}%`
//                 }}
//               ></div>
//             </div>

//             <span>
//               {((result.confidence || 0) * 100).toFixed(1)}%
//             </span>
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

//       {/* USER INPUT */}
//       {result && (
//         <div className="result-card">
//           <h3>User Details</h3>

//           <input
//             type="number"
//             placeholder="Age"
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//           />

//           <select onChange={(e) => setGender(e.target.value)}>
//             <option value="">Gender</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </select>

//           <select onChange={(e) => setGoal(e.target.value)}>
//             <option value="maintain">Maintain</option>
//             <option value="loss">Loss</option>
//             <option value="gain">Gain</option>
//           </select>

//           <input
//             type="text"
//             placeholder="Disease (optional)"
//             value={disease}
//             onChange={(e) => setDisease(e.target.value)}
//           />

//           <button onClick={handleRecommend}>
//             Get Recommendation
//           </button>
//         </div>
//       )}

//       {/* AI RESULT */}
//       {aiResponse && (
//         <div className="result-card">
//           <h3>AI Recommendation</h3>
//           <p>{aiResponse}</p>
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

        "https://fyp-backend-production-82be.up.railway.app/predict",

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

                style={{ width: ${(result.confidence || 0) * 100}% }}

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
