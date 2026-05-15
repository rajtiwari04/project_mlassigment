import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🤖", title: "10 ML Models", desc: "Logistic Regression, Random Forest, XGBoost, ANN, LightGBM and more — you choose." },
  { icon: "⚡", title: "Real-time Predictions", desc: "Results with confidence scores in milliseconds." },
  { icon: "📊", title: "Analytics Dashboard", desc: "Compare model accuracies and view your prediction history." },
  { icon: "🔒", title: "Secure & Private", desc: "JWT authentication — your data stays yours." },
];

const MODELS = [
  "Logistic Regression","Decision Tree","Random Forest",
  "SVM","KNN","Naive Bayes","XGBoost","ANN",
  "Gradient Boosting","LightGBM"
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-6 py-24 text-center">
        <div className="text-7xl mb-6">🌱</div>
        <h1 className="text-5xl font-bold text-gray-800 mb-5 leading-tight">
          AI-Powered Fertilizer<br />Recommendation System
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-10">
          Enter your soil parameters, select any of 10 machine learning models,
          and get the optimal fertilizer recommendation instantly.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition text-lg shadow-md">
            Get Started Free
          </Link>
          <Link to="/login" className="border-2 border-green-600 text-green-700 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition text-lg">
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Why SoilSense?</h2>
        <p className="text-center text-gray-500 mb-12">Powered by machine learning. Built for farmers and researchers.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Models Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">10 ML Models at Your Fingertips</h2>
          <p className="text-gray-500 mb-8">Choose the model that fits your needs, or let the system auto-select the best one.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {MODELS.map(m => (
              <span key={m} className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {m}
              </span>
            ))}
            <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              ✨ Auto Select Best
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-100">
        SoilSense © 2026 — 3rd Year ML Project | Built with React + Flask + MongoDB
      </footer>
    </div>
  );
}
