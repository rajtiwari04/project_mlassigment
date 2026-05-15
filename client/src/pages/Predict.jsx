import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const MODELS = [
  "Auto Select Best Model",
  "Logistic Regression",
  "Decision Tree",
  "Random Forest",
  "SVM",
  "KNN",
  "Naive Bayes",
  "XGBoost",
  "ANN",
  "Gradient Boosting",
  "LightGBM",
];

const SOIL_TYPES = ["Sandy", "Loamy", "Black", "Red", "Clayey"];
const CROP_TYPES = [
  "Wheat", "Maize", "Sugarcane", "Cotton", "Tobacco",
  "Paddy", "Barley", "Oil seeds", "Pulses", "Ground Nuts",
];

const INIT = {
  temperature: 26, humidity: 52, moisture: 38,
  soilType: "Sandy", cropType: "Wheat",
  nitrogen: 37, potassium: 0, phosphorous: 0,
  model: "Auto Select Best Model",
};

function StatBox({ label, value, highlight }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? "bg-green-50 border-green-200" : "bg-white border-gray-100"}`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`font-bold text-lg ${highlight ? "text-green-700 text-2xl" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}

export default function Predict() {
  const [form, setForm]       = useState(INIT);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await axios.post(`${API}/predictions`, form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.msg || "Prediction failed. Make sure all services are running.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setForm(INIT); setResult(null); setError(""); };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🔬 Fertilizer Prediction</h1>
        <p className="text-gray-500 mt-1">Enter soil parameters and select a machine learning model</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-5 text-lg">Soil Parameters</h2>
          <form onSubmit={submit} className="space-y-4">

            {/* Numeric Inputs */}
            <div className="grid grid-cols-2 gap-4">
              {[
                ["temperature", "Temperature (°C)", 0, 60],
                ["humidity",    "Humidity (%)",     0, 100],
                ["moisture",    "Moisture (%)",     0, 100],
                ["nitrogen",    "Nitrogen (N)",     0, 140],
                ["potassium",   "Potassium (K)",    0, 205],
                ["phosphorous", "Phosphorous (P)",  0, 145],
              ].map(([name, label, min, max]) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    type="number"
                    name={name}
                    min={min}
                    max={max}
                    value={form[name]}
                    onChange={handle}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none transition"
                  />
                </div>
              ))}
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Soil Type</label>
              <select name="soilType" value={form.soilType} onChange={handle}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none">
                {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Crop Type */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Crop Type</label>
              <select name="cropType" value={form.cropType} onChange={handle}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none">
                {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* ⭐ MODEL SELECTION — MANDATORY FEATURE */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-green-800 mb-2">
                🤖 Select Machine Learning Model
              </label>
              <select
                name="model"
                value={form.model}
                onChange={handle}
                className="w-full border-2 border-green-400 bg-white rounded-lg px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
              >
                {MODELS.map(m => <option key={m}>{m}</option>)}
              </select>
              <p className="text-xs text-green-600 mt-2">
                "Auto Select" uses the highest-accuracy model automatically
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "⏳ Generating..." : "🌱 Get Recommendation"}
              </button>
              <button type="button" onClick={reset}
                className="px-4 py-3 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition text-sm">
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Result Panel */}
        <div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4 text-sm">
              ❌ {error}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
              <div className="text-6xl mb-4">🧪</div>
              <p className="text-gray-400 font-medium">Your prediction result will appear here</p>
              <p className="text-gray-300 text-sm mt-2">Fill in the form and click "Get Recommendation"</p>
            </div>
          )}

          {loading && (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
              <div className="text-6xl mb-4 animate-spin">⚙️</div>
              <p className="text-gray-500 font-medium">Running {form.model}...</p>
              <p className="text-gray-300 text-sm mt-2">This will only take a second</p>
            </div>
          )}

          {result && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-green-600 px-6 py-4">
                <p className="text-green-100 text-sm font-medium">Prediction Complete ✅</p>
                <p className="text-white font-bold text-lg mt-1">Using: {result.model}</p>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <StatBox label="Recommended Fertilizer" value={result.fertilizer} highlight />
                </div>
                <StatBox label="Confidence Score"  value={`${result.confidence}%`}    />
                <StatBox label="Model Accuracy"    value={`${result.modelAccuracy}%`} />
                <StatBox label="Prediction Time"   value={`${result.predictionMs} ms`} />
                <StatBox label="Model Used"        value={result.model}               />
              </div>

              {/* Confidence Bar */}
              <div className="px-6 pb-6">
                <p className="text-xs text-gray-400 mb-2">Confidence Level</p>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <p className="text-right text-xs text-gray-400 mt-1">{result.confidence}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
