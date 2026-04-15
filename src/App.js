import React, { useState } from "react";
import axios from "axios";

const BACKEND = "https://fyp-backend-production-82be.up.railway.app";

const COLORS = {
  calories: "#FF6B6B",
  protein: "#4ECDC4",
  carbohydrates: "#45B7D1",
  fats: "#FFA07A",
  fiber: "#98D8C8",
  sugars: "#F7DC6F",
  sodium: "#BB8FCE",
};

const ICONS = {
  calories: "🔥",
  protein: "💪",
  carbohydrates: "🌾",
  fats: "🥑",
  fiber: "🥦",
  sugars: "🍬",
  sodium: "🧂",
};

const UNITS = {
  calories: "kcal",
  protein: "g",
  carbohydrates: "g",
  fats: "g",
  fiber: "g",
  sugars: "g",
  sodium: "mg",
};

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [weight, setWeight] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [goal, setGoal] = useState("maintain");
  const [disease, setDisease] = useState("");
  const [step, setStep] = useState(1);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setRecommendation(null);
    setStep(1);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setRecommendation(null);
  };

  const handlePredict = async () => {
    if (!file) { alert("Please select an image"); return; }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("weight", weight);
    setLoading(true);
    setResult(null);
    setRecommendation(null);
    try {
      const res = await axios.post(`${BACKEND}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error calling backend. Check Railway logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecommend = async () => {
    if (!result) return;
    setRecLoading(true);
    setRecommendation(null);
    try {
      const formData = new FormData();
      formData.append("calories", result.calories || 0);
      formData.append("protein", result.protein || 0);
      formData.append("carbohydrates", result.carbohydrates || 0);
      formData.append("fats", result.fats || 0);
      formData.append("fiber", result.fiber || 0);
      formData.append("sugars", result.sugars || 0);
      formData.append("sodium", result.sodium || 0);
      formData.append("goal", goal);
      formData.append("disease", disease || "none");
      const res = await axios.post(`${BACKEND}/recommend`, formData);
      setRecommendation(res.data.recommendations[0]);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("AI recommendation failed.");
    } finally {
      setRecLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setRecommendation(null);
    setStep(1);
    setGoal("maintain");
    setDisease("");
    document.getElementById("fileInput").value = "";
  };

  const nutrients = result
    ? ["calories", "protein", "carbohydrates", "fats", "fiber", "sugars", "sodium"]
    : [];

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logo}>🥗</span>
          <div>
            <h1 style={styles.headerTitle}>NutriScan AI</h1>
            <p style={styles.headerSub}>Instant food nutrition detection powered by AI</p>
          </div>
        </div>
        {/* Steps */}
        <div style={styles.steps}>
          {["Upload", "Nutrition", "AI Advice"].map((s, i) => (
            <div key={i} style={styles.stepWrap}>
              <div style={{
                ...styles.stepDot,
                background: step > i ? "#4ECDC4" : step === i + 1 ? "#fff" : "rgba(255,255,255,0.2)",
                border: step === i + 1 ? "2px solid #4ECDC4" : "2px solid transparent",
                color: step === i + 1 ? "#4ECDC4" : step > i ? "#1a1a2e" : "rgba(255,255,255,0.5)",
              }}>
                {step > i ? "✓" : i + 1}
              </div>
              <span style={{
                ...styles.stepLabel,
                color: step >= i + 1 ? "#fff" : "rgba(255,255,255,0.4)",
              }}>{s}</span>
              {i < 2 && <div style={{
                ...styles.stepLine,
                background: step > i + 1 ? "#4ECDC4" : "rgba(255,255,255,0.2)",
              }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.body}>
        {/* Upload Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📸 Upload Food Image</h2>

          <div
            style={{
              ...styles.dropzone,
              borderColor: preview ? "#4ECDC4" : "rgba(255,255,255,0.15)",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {preview ? (
              <img src={preview} alt="preview" style={styles.preview} />
            ) : (
              <div style={styles.dropContent}>
                <span style={{ fontSize: 48 }}>📷</span>
                <p style={styles.dropText}>Drag & drop or click to upload</p>
                <p style={styles.dropSub}>Supports JPG, PNG, WEBP</p>
              </div>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: "none" }}
          />

          <div style={styles.row}>
            <div style={styles.weightWrap}>
              <label style={styles.label}>⚖️ Weight (grams)</label>
              <input
                type="number"
                min="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <button
              onClick={handlePredict}
              disabled={loading || !file}
              style={{
                ...styles.btn,
                ...styles.btnPrimary,
                opacity: !file ? 0.5 : 1,
              }}
            >
              {loading ? (
                <span>⏳ Analyzing...</span>
              ) : (
                <span>🔍 Detect Nutrition</span>
              )}
            </button>
            {result && (
              <button onClick={reset} style={{ ...styles.btn, ...styles.btnGhost }}>
                🔄 Reset
              </button>
            )}
          </div>
        </div>

        {/* Result Card */}
        {result && (
          <div style={styles.card}>
            <div style={styles.foodHeader}>
              <div>
                <p style={styles.foodLabel}>{result.label?.toUpperCase()}</p>
                <p style={styles.foodSub}>Detected food item</p>
              </div>
              <div style={styles.confidenceBadge}>
                <span style={styles.confidenceNum}>
                  {((result.confidence || 0) * 100).toFixed(1)}%
                </span>
                <span style={styles.confidenceLabel}>confidence</span>
              </div>
            </div>

            {/* Confidence bar */}
            <div style={styles.barTrack}>
              <div style={{
                ...styles.barFill,
                width: `${(result.confidence || 0) * 100}%`,
              }} />
            </div>

            <h3 style={styles.sectionTitle}>
              Nutrition for {result.weight}g
            </h3>

            {/* Nutrition Grid */}
            <div style={styles.nutriGrid}>
              {nutrients.map((key) => (
                <div key={key} style={{
                  ...styles.nutriCard,
                  borderTop: `3px solid ${COLORS[key]}`,
                }}>
                  <span style={styles.nutriIcon}>{ICONS[key]}</span>
                  <span style={styles.nutriValue}>
                    {Number(result[key] || 0).toFixed(1)}
                  </span>
                  <span style={styles.nutriUnit}>{UNITS[key]}</span>
                  <span style={styles.nutriName}>{key}</span>
                </div>
              ))}
            </div>

            {/* Recommendation section */}
            <h3 style={{ ...styles.sectionTitle, marginTop: 24 }}>
              🤖 Get AI Recommendation
            </h3>

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>🎯 Your Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  style={styles.input}
                >
                  <option value="maintain">Maintain Weight</option>
                  <option value="lose weight">Lose Weight</option>
                  <option value="gain muscle">Gain Muscle</option>
                  <option value="diabetic diet">Diabetic Diet</option>
                  <option value="heart healthy">Heart Healthy</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>🏥 Disease / Condition</label>
                <input
                  type="text"
                  placeholder="e.g. diabetes, none"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <button
              onClick={handleRecommend}
              disabled={recLoading}
              style={{ ...styles.btn, ...styles.btnGemini }}
            >
              {recLoading ? "✨ AI thinking..." : "✨ Get AI Advice"}
            </button>
          </div>
        )}

        {/* Recommendation Card */}
        {recommendation && (
          <div style={{ ...styles.card, ...styles.recCard }}>
            <div style={styles.recHeader}>
              <span style={{ fontSize: 28 }}>🤖</span>
              <div>
                <h2 style={styles.recTitle}>AI Recommendation</h2>
                <p style={styles.recSub}>Get Insights</p>
              </div>
            </div>
            <div style={styles.recBody}>
              {recommendation.split("\n").map((line, i) => (
                line.trim() && (
                  <p key={i} style={{
                    ...styles.recLine,
                    fontWeight: line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") ? 600 : 400,
                    color: line.startsWith("1.") ? "#4ECDC4" : "#e0e0e0",
                    fontSize: line.startsWith("1.") ? 16 : 14,
                  }}>
                    {line}
                  </p>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p>NutriScan AI — FYP Project 2026</p>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#fff",
  },
  header: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    padding: "20px 32px",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  logo: { fontSize: 40 },
  headerTitle: { margin: 0, fontSize: 26, fontWeight: 700 },
  headerSub: { margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" },
  steps: {
    display: "flex",
    alignItems: "center",
    gap: 0,
  },
  stepWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    transition: "all 0.3s",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: 500,
    transition: "color 0.3s",
  },
  stepLine: {
    width: 40,
    height: 2,
    margin: "0 8px",
    transition: "background 0.3s",
  },
  body: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "32px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  card: {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 28,
  },
  cardTitle: {
    margin: "0 0 20px",
    fontSize: 18,
    fontWeight: 600,
  },
  dropzone: {
    border: "2px dashed",
    borderRadius: 16,
    padding: 32,
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.3s",
    marginBottom: 20,
    minHeight: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  dropText: {
    margin: 0,
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
  },
  dropSub: {
    margin: 0,
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  preview: {
    maxHeight: 240,
    maxWidth: "100%",
    borderRadius: 12,
    objectFit: "contain",
  },
  row: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
    alignItems: "flex-end",
  },
  weightWrap: { flex: 1 },
  label: {
    display: "block",
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  btn: {
    padding: "12px 24px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #4ECDC4, #44A08D)",
    color: "#fff",
    flex: 1,
  },
  btnGhost: {
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  btnGemini: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    width: "100%",
    marginTop: 8,
    fontSize: 15,
    padding: "14px 24px",
  },
  foodHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  foodLabel: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "#4ECDC4",
  },
  foodSub: {
    margin: 0,
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  confidenceBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(78,205,196,0.15)",
    border: "1px solid rgba(78,205,196,0.3)",
    borderRadius: 12,
    padding: "8px 16px",
  },
  confidenceNum: {
    fontSize: 22,
    fontWeight: 700,
    color: "#4ECDC4",
  },
  confidenceLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
  },
  barTrack: {
    height: 6,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 99,
    marginBottom: 24,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "linear-gradient(90deg, #4ECDC4, #44A08D)",
    borderRadius: 99,
    transition: "width 0.8s ease",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: 15,
    fontWeight: 600,
    color: "rgba(255,255,255,0.8)",
  },
  nutriGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: 12,
  },
  nutriCard: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "14px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    transition: "transform 0.2s",
  },
  nutriIcon: { fontSize: 22 },
  nutriValue: { fontSize: 18, fontWeight: 700 },
  nutriUnit: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  nutriName: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    textTransform: "capitalize",
    textAlign: "center",
  },
  recCard: {
    background: "rgba(102,126,234,0.1)",
    border: "1px solid rgba(102,126,234,0.3)",
  },
  recHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  recTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
  recSub: {
    margin: 0,
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
  },
  recBody: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  recLine: {
    margin: 0,
    lineHeight: 1.7,
  },
  footer: {
    textAlign: "center",
    padding: "20px",
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
  },
};
