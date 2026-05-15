from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
import time
import os
import numpy as np

app = Flask(__name__)
CORS(app)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

# ── Sklearn model registry ────────────────────────────────────────
SKLEARN_MODELS = {
    "Logistic Regression": "logistic.pkl",
    "Decision Tree": "decision_tree.pkl",
    "Random Forest": "random_forest.pkl",
    "SVM": "svm.pkl",
    "KNN": "knn.pkl",
    "Naive Bayes": "naive_bayes.pkl",
    "XGBoost": "xgboost.pkl",
    "Gradient Boosting": "gradient_boosting.pkl",
    "LightGBM": "lightgbm.pkl",
}

# Lazy-loaded model cache
_model_cache = {}

def load_model(name):
    """Load model from disk into cache (lazy loading)."""

    if name in _model_cache:
        return _model_cache[name]

    if name in SKLEARN_MODELS:
        path = os.path.join(MODEL_DIR, SKLEARN_MODELS[name])
        _model_cache[name] = joblib.load(path)
    else:
        return None

    return _model_cache[name]

# ── Preprocessing artifacts ───────────────────────────────────────
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
le_soil = joblib.load(os.path.join(MODEL_DIR, "le_soil.pkl"))
le_crop = joblib.load(os.path.join(MODEL_DIR, "le_crop.pkl"))
le_fert = joblib.load(os.path.join(MODEL_DIR, "le_fertilizer.pkl"))

# ── Model metrics ─────────────────────────────────────────────────
metrics_path = os.path.join(MODEL_DIR, "metrics.json")

with open(metrics_path) as f:
    MODEL_METRICS = json.load(f)

def best_model_name():
    return max(MODEL_METRICS, key=lambda k: MODEL_METRICS[k]["accuracy"])

def preprocess(data):
    soil_enc = le_soil.transform([data["soilType"]])[0]
    crop_enc = le_crop.transform([data["cropType"]])[0]

    features = np.array([[
        float(data["temperature"]),
        float(data["humidity"]),
        float(data["moisture"]),
        float(soil_enc),
        float(crop_enc),
        float(data["nitrogen"]),
        float(data["potassium"]),
        float(data["phosphorous"]),
    ]])

    return scaler.transform(features)

# ── Routes ────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "models_cached": list(_model_cache.keys()),
        "models_available": list(SKLEARN_MODELS.keys()),
    })

@app.route("/models", methods=["GET"])
def list_models():
    all_models = list(SKLEARN_MODELS.keys())

    return jsonify({
        "models": all_models,
        "best": best_model_name(),
        "total": len(all_models),
    })

@app.route("/metrics", methods=["GET"])
def get_metrics():
    return jsonify(MODEL_METRICS)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON body received"}), 400

        required = [
            "temperature",
            "humidity",
            "moisture",
            "soilType",
            "cropType",
            "nitrogen",
            "potassium",
            "phosphorous",
        ]

        missing = [f for f in required if f not in data]

        if missing:
            return jsonify({"error": f"Missing fields: {missing}"}), 400

        model_name = data.get("model", "Auto Select Best Model")

        if model_name == "Auto Select Best Model":
            model_name = best_model_name()

        model = load_model(model_name)

        if model is None:
            return jsonify({"error": f"Model '{model_name}' not found"}), 404

        X = preprocess(data)

        start = time.time()

        probs = model.predict_proba(X)[0]

        idx = int(np.argmax(probs))
        conf = float(round(float(probs[idx]) * 100, 2))

        fertilizer = str(le_fert.classes_[idx])

        pred_ms = round((time.time() - start) * 1000, 2)

        accuracy = MODEL_METRICS.get(model_name, {}).get("accuracy", 0)

        return jsonify({
            "fertilizer": fertilizer,
            "confidence": conf,
            "model": model_name,
            "modelAccuracy": accuracy,
            "predictionMs": pred_ms,
        })

    except ValueError as e:
        return jsonify({"error": f"Invalid input value: {str(e)}"}), 400

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🌱 SoilSense ML API starting...")
    print(f"📁 Model directory: {MODEL_DIR}")
    print(f"🤖 Available models: {list(SKLEARN_MODELS.keys())}")

    app.run(host="0.0.0.0", port=8000)