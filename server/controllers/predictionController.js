const axios      = require("axios");
const Prediction = require("../models/Prediction");

const ML_URL = () => process.env.ML_API_URL || "http://localhost:8000";

// @route   POST /api/predictions
// @access  Private
exports.predict = async (req, res) => {
  try {
    const {
      temperature, humidity, moisture,
      soilType, cropType,
      nitrogen, potassium, phosphorous,
      model,
    } = req.body;

    // Validate required fields
    if (
      temperature == null || humidity == null || moisture == null ||
      !soilType || !cropType ||
      nitrogen == null || potassium == null || phosphorous == null
    ) {
      return res.status(400).json({ msg: "All soil parameters are required" });
    }

    // Call Python Flask ML API
    const mlResponse = await axios.post(`${ML_URL()}/predict`, {
      temperature: Number(temperature),
      humidity:    Number(humidity),
      moisture:    Number(moisture),
      soilType,
      cropType,
      nitrogen:    Number(nitrogen),
      potassium:   Number(potassium),
      phosphorous: Number(phosphorous),
      model:       model || "Auto Select Best Model",
    });

    const {
      fertilizer,
      confidence,
      model: usedModel,
      modelAccuracy,
      predictionMs,
    } = mlResponse.data;

    // Save to MongoDB
    const record = await Prediction.create({
      userId:              req.user._id,
      temperature:         Number(temperature),
      humidity:            Number(humidity),
      moisture:            Number(moisture),
      soilType,
      cropType,
      nitrogen:            Number(nitrogen),
      potassium:           Number(potassium),
      phosphorous:         Number(phosphorous),
      selectedModel:       usedModel,
      predictedFertilizer: fertilizer,
      confidence,
      modelAccuracy,
      predictionMs,
    });

    res.status(201).json({
      id:           record._id,
      fertilizer,
      confidence,
      model:        usedModel,
      modelAccuracy,
      predictionMs,
      createdAt:    record.createdAt,
    });
  } catch (err) {
    console.error("Predict error:", err.message);
    if (err.code === "ECONNREFUSED") {
      return res.status(503).json({ msg: "ML API is not running. Start Flask server on port 8000." });
    }
    res.status(500).json({ msg: err.response?.data?.error || err.message });
  }
};

// @route   GET /api/predictions
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(predictions);
  } catch (err) {
    console.error("Get history error:", err.message);
    res.status(500).json({ msg: "Server error fetching predictions" });
  }
};

// @route   GET /api/predictions/:id
// @access  Private
exports.getOne = async (req, res) => {
  try {
    const prediction = await Prediction.findOne({
      _id:    req.params.id,
      userId: req.user._id,
    });
    if (!prediction)
      return res.status(404).json({ msg: "Prediction not found" });
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @route   DELETE /api/predictions/:id
// @access  Private
exports.deleteOne = async (req, res) => {
  try {
    const prediction = await Prediction.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user._id,
    });
    if (!prediction)
      return res.status(404).json({ msg: "Prediction not found" });
    res.json({ msg: "Prediction deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ msg: "Server error deleting prediction" });
  }
};

// @route   GET /api/predictions/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const total   = await Prediction.countDocuments({ userId: req.user._id });
    const avgConf = await Prediction.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, avg: { $avg: "$confidence" } } },
    ]);
    const topModels = await Prediction.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: "$selectedModel", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json({
      total,
      avgConfidence: avgConf[0]?.avg?.toFixed(2) || 0,
      topModels,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
