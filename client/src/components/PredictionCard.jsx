export default function PredictionCard({ data, onDelete }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition flex items-center justify-between">
      <div className="flex gap-8 text-sm">
        <div>
          <p className="text-xs text-gray-400 mb-1">Fertilizer</p>
          <p className="font-bold text-green-700 text-base">{data.predictedFertilizer}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Model Used</p>
          <p className="font-medium text-gray-700">{data.selectedModel}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Confidence</p>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
            {data.confidence}%
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Model Accuracy</p>
          <p className="font-medium text-gray-700">{data.modelAccuracy}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Soil / Crop</p>
          <p className="font-medium text-gray-700">{data.soilType} / {data.cropType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Date</p>
          <p className="text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(data._id)}
          className="text-red-400 hover:text-red-600 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition text-xs ml-4"
        >
          Delete
        </button>
      )}
    </div>
  );
}
