import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PredictionCard from "../components/PredictionCard";

const API = import.meta.env.VITE_API_URL;

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("");

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(`${API}/predictions`);
      setPredictions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const deleteOne = async (id) => {
    if (!window.confirm("Delete this prediction?")) return;
    await axios.delete(`${API}/predictions/${id}`);
    setPredictions(p => p.filter(x => x._id !== id));
  };

  const filtered = filter
    ? predictions.filter(p =>
        p.predictedFertilizer.toLowerCase().includes(filter.toLowerCase()) ||
        p.selectedModel.toLowerCase().includes(filter.toLowerCase()) ||
        p.cropType.toLowerCase().includes(filter.toLowerCase())
      )
    : predictions;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📋 Prediction History</h1>
          <p className="text-gray-500 mt-1">{predictions.length} predictions recorded</p>
        </div>
        <Link to="/predict"
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition">
          + New Prediction
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by fertilizer, model, crop..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-400 outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">{predictions.length === 0 ? "📭" : "🔍"}</div>
          <p className="text-gray-400 font-medium">
            {predictions.length === 0
              ? "No predictions yet."
              : "No results match your search."}
          </p>
          {predictions.length === 0 && (
            <Link to="/predict" className="text-green-600 mt-2 inline-block hover:underline text-sm">
              Make your first prediction →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <PredictionCard key={p._id} data={p} onDelete={deleteOne} />
          ))}
        </div>
      )}
    </div>
  );
}
