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




from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from predict_nutrient import predict_nutrients
from download_model import download_model
import os

# Initialize FastAPI
app = FastAPI()

# Ensure model is downloaded from Drive
download_model()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Recommendation Logic
# -----------------------------
def generate_recommendation(nutrition, goal, disease):
    recommendations = []

    calories = nutrition.get("calories", 0)
    sugar = nutrition.get("sugars", 0)
    sodium = nutrition.get("sodium", 0)
    fats = nutrition.get("fats", 0)

    # Goal-based
    if goal == "weight_loss":
        if calories > 400:
            recommendations.append("High calories – reduce portion size.")
        if fats > 20:
            recommendations.append("High fat – avoid frequent consumption.")
        recommendations.append("Prefer boiled, grilled or low-oil foods.")

    elif goal == "weight_gain":
        if calories > 300:
            recommendations.append("Good high-energy food for weight gain.")
        else:
            recommendations.append("Add more calorie-dense foods with this meal.")

    elif goal == "maintain":
        recommendations.append("Consume in moderate portion to maintain weight.")

    # Disease-based
    if disease == "diabetes":
        if sugar > 10:
            recommendations.append("High sugar – not recommended for diabetes.")

    if disease == "hypertension":
        if sodium > 400:
            recommendations.append("High sodium – avoid for blood pressure patients.")

    # General
    if calories < 150:
        recommendations.append("Low calorie – healthy light option.")

    return recommendations


# -----------------------------
# Prediction Endpoint
# -----------------------------
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    weight: float = Form(...),
    gender: str = Form(None),
    age: int = Form(None),
    goal: str = Form("maintain"),
    disease: str = Form(None)
):
    # Save file temporarily
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Nutrition prediction (UNCHANGED)
    result = predict_nutrients(file_location, weight)

    # Remove temp file
    if os.path.exists(file_location):
        os.remove(file_location)

    # -----------------------------
    # Add Recommendation
    # -----------------------------
    recommendations = generate_recommendation(result, goal, disease)

    # Add into response
    result["recommendations"] = recommendations
    result["user_goal"] = goal
    result["disease"] = disease

    return result


# Run server
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
