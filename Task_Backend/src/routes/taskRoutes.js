const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateStatus,
} = require("../controllers/taskController");

router.use(authMiddleware);

router.get("/getTask", getTasks);
router.post("/createTask", createTask);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", roleMiddleware, deleteTask);
router.patch("/:id/status", updateStatus);

module.exports = router;
