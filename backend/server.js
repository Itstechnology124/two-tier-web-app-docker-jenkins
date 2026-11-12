
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { db, testConnection } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      status: "OK",
      message: "Backend and MySQL are running"
    });
  } catch (error) {
    console.error("Health check failed:", error.message);

    res.status(503).json({
      status: "ERROR",
      message: "Database unavailable"
    });
  }
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const [tasks] = await db.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error.message);

    res.status(500).json({
      message: "Failed to retrieve tasks"
    });
  }
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const [result] = await db.query(
      "INSERT INTO tasks (title) VALUES (?)",
      [title.trim()]
    );

    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Create task error:", error.message);

    res.status(500).json({
      message: "Failed to create task"
    });
  }
});

// Update task completion
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const completed = req.body.completed;

    if (!Number.isInteger(id) || id <= 0 ||
        typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Invalid task ID or completion status"
      });
    }

    const [result] = await db.query(
      "UPDATE tasks SET completed = ? WHERE id = ?",
      [completed, id]
    );

    if (result.affectedRows === 0) {
      const [existing] = await db.query(
        "SELECT id FROM tasks WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          message: "Task not found"
        });
      }
    }

    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Update task error:", error.message);

    res.status(500).json({
      message: "Failed to update task"
    });
  }
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid task ID"
      });
    }

    const [result] = await db.query(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error.message);

    res.status(500).json({
      message: "Failed to delete task"
    });
  }
});

// Start server after checking database
async function startServer() {
  try {
    await testConnection();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();