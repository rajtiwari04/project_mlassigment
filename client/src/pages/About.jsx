const MODELS = [
  { name: "Logistic Regression", acc: "~81%", type: "Linear" },
  { name: "Decision Tree",       acc: "~88%", type: "Tree" },
  { name: "Random Forest",       acc: "~97%", type: "Ensemble" },
  { name: "SVM",                 acc: "~90%", type: "Kernel" },
  { name: "KNN",                 acc: "~85%", type: "Instance" },
  { name: "Naive Bayes",         acc: "~76%", type: "Probabilistic" },
  { name: "XGBoost",             acc: "~96%", type: "Boosting" },
  { name: "ANN",                 acc: "~93%", type: "Deep Learning" },
  { name: "Gradient Boosting",   acc: "~94%", type: "Boosting" },
  { name: "LightGBM",            acc: "~95%", type: "Boosting" },
];

const FEATURES = [
  { name: "Temperature",  unit: "°C",  range: "0–60" },
  { name: "Humidity",     unit: "%",   range: "0–100" },
  { name: "Moisture",     unit: "%",   range: "0–100" },
  { name: "Soil Type",    unit: "—",   range: "5 types" },
  { name: "Crop Type",    unit: "—",   range: "10 crops" },
  { name: "Nitrogen",     unit: "kg/ha", range: "0–140" },
  { name: "Potassium",    unit: "kg/ha", range: "0–205" },
  { name: "Phosphorous",  unit: "kg/ha", range: "0–145" },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-14">
        <div className="text-6xl mb-5">🌱</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About SoilSense</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          An AI-powered fertilizer recommendation system built as a 3rd  Year
          Machine Learning project. Uses 10 ML algorithms trained on real soil data
          to recommend the optimal fertilizer for any crop and soil combination.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["⚛️", "Frontend", "React.js + Tailwind CSS"],
            ["🟢", "Backend",  "Node.js + Express.js"],
            ["🐍", "ML API",   "Python + Flask"],
            ["🍃", "Database", "MongoDB Atlas"],
          ].map(([icon, layer, tech]) => (
            <div key={layer} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-3xl mb-2">{icon}</div>
              <p className="font-semibold text-gray-700 text-sm">{layer}</p>
              <p className="text-gray-400 text-xs mt-1">{tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ML Models Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">10 Machine Learning Models</h2>
          <p className="text-gray-400 text-sm mt-1">All models are trained, evaluated, and available for selection</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-semibold">
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Model</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Expected Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {MODELS.map((m, i) => (
              <tr key={m.name} className="border-t border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{m.name}</td>
                <td className="px-6 py-3">
                  <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{m.type}</span>
                </td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    parseFloat(m.acc) >= 95 ? "bg-green-100 text-green-700" :
                    parseFloat(m.acc) >= 88 ? "bg-yellow-100 text-yellow-700" :
                    "bg-orange-100 text-orange-700"
                  }`}>
                    {m.acc}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dataset Features */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Input Features</h2>
          <p className="text-gray-400 text-sm mt-1">Kaggle Fertilizer Prediction Dataset — 8 features, 7 fertilizer classes</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          {FEATURES.map(f => (
            <div key={f.name} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="font-semibold text-gray-700 text-sm">{f.name}</p>
              <p className="text-gray-400 text-xs mt-1">Unit: {f.unit}</p>
              <p className="text-gray-400 text-xs">Range: {f.range}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">How It Works</h2>
        <div className="flex flex-wrap justify-center gap-2 items-center text-sm font-medium">
          {[
            "1. Enter soil data",
            "→",
            "2. Select ML model",
            "→",
            "3. Node.js API",
            "→",
            "4. Flask ML API",
            "→",
            "5. Load model",
            "→",
            "6. Get fertilizer",
            "→",
            "7. Save to MongoDB",
          ].map((step, i) => (
            step === "→"
              ? <span key={i} className="text-gray-300 text-xl">→</span>
              : <span key={i} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg">
                  {step}
                </span>
          ))}
        </div>
      </div>
    </div>
  );
}
