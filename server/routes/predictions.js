const router = require("express").Router();
const {
  predict,
  getHistory,
  getOne,
  deleteOne,
  getStats,
} = require("../controllers/predictionController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/",         predict);
router.get("/",          getHistory);
router.get("/stats",     getStats);
router.get("/:id",       getOne);
router.delete("/:id",    deleteOne);

module.exports = router;
