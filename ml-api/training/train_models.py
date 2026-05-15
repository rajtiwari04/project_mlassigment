"""
Train all 10 ML models, save as .pkl / .h5, and write metrics.json
Run from ml-api/ directory:
    python training/train_models.py
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import json
import time
import joblib
import numpy as np

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

from preprocessing.preprocessor import load_and_preprocess

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# ── Load and preprocess data ──────────────────────────────────────
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "Fertilizer Prediction.csv")
X_train, X_test, y_train, y_test, classes = load_and_preprocess(
    csv_path=CSV_PATH, model_dir=MODEL_DIR
)
n_classes = len(classes)
metrics   = {}

print(f"\n🚀 Training {10} models on {X_train.shape[0]} samples...\n")
print(f"{'Model':<25} {'Accuracy':>10} {'Time':>8}")
print("-" * 47)

def train_save(model, name, filename):
    start = time.time()
    model.fit(X_train, y_train)
    elapsed = round(time.time() - start, 2)
    preds   = model.predict(X_test)
    acc     = round(accuracy_score(y_test, preds) * 100, 2)
    metrics[name] = {"accuracy": acc, "train_time_s": elapsed}
    print(f"{name:<25} {acc:>9}% {elapsed:>6}s")
    joblib.dump(model, os.path.join(MODEL_DIR, filename))
    return acc

# 1. Logistic Regression
train_save(
    LogisticRegression(max_iter=2000, C=1.0, solver="lbfgs",
                       multi_class="auto", random_state=42),
    "Logistic Regression", "logistic.pkl"
)

# 2. Decision Tree
train_save(
    DecisionTreeClassifier(max_depth=12, min_samples_split=4,
                            random_state=42),
    "Decision Tree", "decision_tree.pkl"
)

# 3. Random Forest
train_save(
    RandomForestClassifier(n_estimators=200, max_depth=14,
                            min_samples_split=2, random_state=42,
                            n_jobs=-1),
    "Random Forest", "random_forest.pkl"
)

# 4. SVM
train_save(
    SVC(kernel="rbf", C=10, gamma="scale",
        probability=True, random_state=42),
    "SVM", "svm.pkl"
)

# 5. KNN
train_save(
    KNeighborsClassifier(n_neighbors=5, metric="euclidean", n_jobs=-1),
    "KNN", "knn.pkl"
)

# 6. Naive Bayes
train_save(
    GaussianNB(), "Naive Bayes", "naive_bayes.pkl"
)

# 7. XGBoost
train_save(
    XGBClassifier(n_estimators=200, learning_rate=0.1, max_depth=6,
                  use_label_encoder=False, eval_metric="mlogloss",
                  random_state=42, n_jobs=-1),
    "XGBoost", "xgboost.pkl"
)

# 8. Gradient Boosting
train_save(
    GradientBoostingClassifier(n_estimators=150, learning_rate=0.1,
                                max_depth=5, random_state=42),
    "Gradient Boosting", "gradient_boosting.pkl"
)

# 9. LightGBM
train_save(
    LGBMClassifier(n_estimators=200, learning_rate=0.05,
                   num_leaves=31, random_state=42, n_jobs=-1),
    "LightGBM", "lightgbm.pkl"
)

# 10. ANN (TensorFlow/Keras)
print(f"{'ANN':<25}", end=" ", flush=True)
try:
    import tensorflow as tf
    ann_start = time.time()

    ann = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(8,)),
        tf.keras.layers.Dense(256, activation="relu"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(64, activation="relu"),
        tf.keras.layers.Dense(n_classes, activation="softmax"),
    ])
    ann.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    ann.fit(
        X_train, y_train,
        epochs=60,
        batch_size=32,
        validation_split=0.1,
        verbose=0,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor="val_loss", patience=8, restore_best_weights=True
            )
        ],
    )
    _, ann_acc = ann.evaluate(X_test, y_test, verbose=0)
    ann_acc    = round(ann_acc * 100, 2)
    ann_time   = round(time.time() - ann_start, 2)
    metrics["ANN"] = {"accuracy": ann_acc, "train_time_s": ann_time}
    print(f"{ann_acc:>9}% {ann_time:>6}s")
    ann.save(os.path.join(MODEL_DIR, "ann.h5"))
except Exception as e:
    print(f"\n  ⚠️  ANN skipped (TensorFlow not installed): {e}")
    metrics["ANN"] = {"accuracy": 0, "train_time_s": 0}

# ── Save metrics ──────────────────────────────────────────────────
print("-" * 47)
best = max(metrics, key=lambda k: metrics[k]["accuracy"])
print(f"\n🏆 Best model: {best} ({metrics[best]['accuracy']}%)")

metrics_path = os.path.join(MODEL_DIR, "metrics.json")
with open(metrics_path, "w") as f:
    json.dump(metrics, f, indent=2)

print(f"\n✅ All models saved to: {MODEL_DIR}")
print(f"✅ Metrics saved to: {metrics_path}")
print("\nFull results:")
for name, m in sorted(metrics.items(), key=lambda x: -x[1]["accuracy"]):
    print(f"  {name:<25} {m['accuracy']:>6}%")
