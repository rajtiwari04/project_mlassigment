import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;
const ML  = import.meta.env.VITE_ML_URL;
const COLORS = ["#16a34a","#0891b2","#d97706","#dc2626","#7c3aed","#db2777","#059669","#ea580c"];

export default function Dashboard() {
  const { user }                    = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [metrics, setMetrics]         = useState({});
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/predictions`),
      axios.get(`${ML}/metrics`).catch(() => ({ data: {} })),
    ]).then(([predRes, metRes]) => {
      setPredictions(predRes.data);
      setMetrics(metRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const fertilizerCounts = predictions.reduce((acc, p) => {
    acc[p.predictedFertilizer] = (acc[p.predictedFertilizer] || 0) + 1;
    return acc;
  }, {});
  const pieData  = Object.entries(fertilizerCounts).map(([name, value]) => ({ name, value }));
  const barData  = Object.entries(metrics).map(([name, m]) => ({ name, accuracy: m.accuracy }));
  const avgConf  = predictions.length
    ? (predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length).toFixed(1)
    : "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-spin">⚙️</div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your soil prediction overview</p>
        </div>
        <Link to="/predict"
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm">
          + New Prediction
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          ["🔬", "Total Predictions", predictions.length],
          ["📊", "Avg Confidence",    avgConf + (avgConf !== "—" ? "%" : "")],
          ["🤖", "Models Available",  Object.keys(metrics).length || 10],
        ].map(([icon, label, val]) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-400 text-sm mb-2">{icon} {label}</p>
            <p className="text-3xl font-bold text-gray-800">{val}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Model Accuracy Bar Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Model Accuracies (%)</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -15, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="accuracy" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
              Connect ML API to see model metrics
            </div>
          )}
        </div>

        {/* Fertilizer Pie Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Fertilizer Distribution</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm flex-col gap-2">
              <span className="text-4xl">🌱</span>
              <span>No predictions yet</span>
              <Link to="/predict" className="text-green-600 text-sm hover:underline">Make your first one →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Recent Predictions</h2>
          <Link to="/history" className="text-green-600 text-sm hover:underline font-medium">
            View all →
          </Link>
        </div>
        {predictions.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No predictions yet. <Link to="/predict" className="text-green-600 hover:underline">Make your first one!</Link></p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-medium">
                <th className="px-6 py-3 text-left">Fertilizer</th>
                <th className="px-6 py-3 text-left">Model</th>
                <th className="px-6 py-3 text-left">Confidence</th>
                <th className="px-6 py-3 text-left">Soil / Crop</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {predictions.slice(0, 8).map((p) => (
                <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-3 font-semibold text-green-700">{p.predictedFertilizer}</td>
                  <td className="px-6 py-3 text-gray-600">{p.selectedModel}</td>
                  <td className="px-6 py-3">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {p.confidence}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{p.soilType} / {p.cropType}</td>
                  <td className="px-6 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
