# 🌱 Soil Health & Fertilizer Recommendation System

> AI-powered MERN Stack application using 10 Machine Learning models for precision agriculture

---

## 🚀 Quick Start (3 terminals)

### Terminal 1 — ML API (Python)
```bash
cd ml-api
pip install -r requirements.txt
python training/train_models.py    # trains all 10 models (~2 mins)
python app.py                      # starts Flask on :8000
```

### Terminal 2 — Node Backend
```bash
cd server
npm install
cp .env.example .env               # fill in MONGO_URI + JWT_SECRET
npm run dev                        # starts Express on :5000
```

### Terminal 3 — React Frontend
```bash
cd client
npm install
cp .env.example .env               # set VITE_API_URL + VITE_ML_URL
npm run dev                        # starts Vite on :5173
```

Open: http://localhost:5173

---

## 📁 Project Structure

```
soil-fertilizer-ml/
├── client/                  ← React + Tailwind frontend
│   └── src/
│       ├── pages/           ← Landing, Login, Register, Dashboard, Predict, History, About
│       ├── components/      ← Navbar, PredictionCard, ProtectedRoute
│       ├── context/         ← AuthContext (JWT)
│       └── services/        ← api.js (axios wrappers)
│
├── server/                  ← Node.js + Express backend
│   ├── controllers/         ← authController, predictionController
│   ├── routes/              ← auth.js, predictions.js
│   ├── models/              ← User.js, Prediction.js (Mongoose)
│   ├── middleware/          ← authMiddleware.js (JWT protect)
│   └── config/              ← db.js (MongoDB connection)
│
├── ml-api/                  ← Python Flask ML service
│   ├── training/            ← train_models.py (all 10 models)
│   ├── preprocessing/       ← preprocessor.py
│   ├── models/              ← saved .pkl + .h5 + metrics.json
│   └── app.py               ← Flask routes /predict /models /metrics
│
└── docker-compose.yml
```

---

## 🤖 ML Models Trained

| # | Model              | Expected Accuracy |
|---|--------------------|-------------------|
| 1 | Logistic Regression| ~81%             |
| 2 | Decision Tree      | ~88%             |
| 3 | Random Forest      | ~97%             |
| 4 | SVM                | ~90%             |
| 5 | KNN                | ~85%             |
| 6 | Naive Bayes        | ~76%             |
| 7 | XGBoost            | ~96%             |
| 8 | ANN                | ~93%             |
| 9 | Gradient Boosting  | ~94%             |
|10 | LightGBM           | ~95%             |

---

## 🌐 API Reference

### Node.js Backend (port 5000)
| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| POST   | /api/auth/register      | Register user        |
| POST   | /api/auth/login         | Login                |
| GET    | /api/auth/me            | Get current user     |
| POST   | /api/predictions        | Make prediction      |
| GET    | /api/predictions        | Get history          |
| DELETE | /api/predictions/:id    | Delete prediction    |
| GET    | /api/predictions/stats  | Get user stats       |

### Python Flask ML API (port 8000)
| Method | Endpoint   | Description           |
|--------|------------|-----------------------|
| GET    | /health    | Health check          |
| GET    | /models    | List all models       |
| GET    | /metrics   | Model accuracies      |
| POST   | /predict   | Run prediction        |

---

## ⚙️ Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/soildb
JWT_SECRET=your_secret_key_here
ML_API_URL=http://localhost:8000
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
VITE_ML_URL=http://localhost:8000
```

---

## 🎓 Project Info
- **Type**: Final Year B.Tech / MCA Project
- **Domain**: Machine Learning + Full Stack Web Dev
- **Dataset**: [Kaggle Fertilizer Prediction](https://www.kaggle.com/datasets/gdabhishek/fertilizer-prediction)
