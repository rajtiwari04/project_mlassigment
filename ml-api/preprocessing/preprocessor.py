import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os

def load_and_preprocess(csv_path="Fertilizer Prediction.csv", model_dir="models"):
    """
    Load CSV, encode categoricals, scale features, split data.
    Saves: scaler.pkl, le_soil.pkl, le_crop.pkl, le_fertilizer.pkl
    Returns: X_train, X_test, y_train, y_test, class_names
    """
    os.makedirs(model_dir, exist_ok=True)

    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip()

    print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"   Columns: {df.columns.tolist()}")
    print(f"   Missing values: {df.isnull().sum().sum()}")
    print(f"   Duplicates: {df.duplicated().sum()}")

    # Drop duplicates
    df.drop_duplicates(inplace=True)

    # Encode categorical columns
    le_soil = LabelEncoder()
    le_crop = LabelEncoder()
    le_fert = LabelEncoder()

    df["Soil Type_enc"]  = le_soil.fit_transform(df["Soil Type"])
    df["Crop Type_enc"]  = le_crop.fit_transform(df["Crop Type"])
    df["Fertilizer_enc"] = le_fert.fit_transform(df["Fertilizer Name"])

    # Save encoders
    joblib.dump(le_soil, os.path.join(model_dir, "le_soil.pkl"))
    joblib.dump(le_crop, os.path.join(model_dir, "le_crop.pkl"))
    joblib.dump(le_fert, os.path.join(model_dir, "le_fertilizer.pkl"))
    print(f"   Fertilizer classes: {list(le_fert.classes_)}")

    # Features and target
    feature_cols = [
        "Temparature", "Humidity", "Moisture",
        "Soil Type_enc", "Crop Type_enc",
        "Nitrogen", "Potassium", "Phosphorous",
    ]
    X = df[feature_cols].values
    y = df["Fertilizer_enc"].values

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"   Train: {X_train.shape[0]} | Test: {X_test.shape[0]}")
    return X_train, X_test, y_train, y_test, le_fert.classes_
