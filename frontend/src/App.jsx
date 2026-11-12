
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();

      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      setError("");
    } catch (err) {
      console.error("Add task error:", err);
      setError("Could not add task.");
    }
  };

  // Toggle task completion
  const toggleTask = async (task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !task.completed
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      setTasks((prev) =>
        prev.map((item) =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch (err) {
      console.error("Update error:", err);
      setError("Could not update task.");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Could not delete task.");
    }
  };

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="app">
      <div className="container">
        <header>
          <span className="eyebrow">DEVOPS LEARNING PROJECT</span>
          <h1>Task Manager</h1>
          <p>Build. Containerize. Automate. Deploy.</p>
        </header>

        <div className="stats">
          <div>
            <strong>{tasks.length}</strong>
            <span>Total Tasks</span>
          </div>

          <div>
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>

          <div>
            <strong>{tasks.length - completedCount}</strong>
            <span>Pending</span>
          </div>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit">Add Task +</button>
        </form>

        {error && <div className="error">{error}</div>}

        <section className="task-section">
          <h2>Your Tasks</h2>

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty">No tasks yet. Add your first task!</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id}>
                  <label className="task-item">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />

                    <span
                      className={
                        task.completed ? "completed" : ""
                      }
                    >
                      {task.title}
                    </span>
                  </label>

                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer>
          React.js + Node.js + Express
        </footer>
      </div>
    </div>
  );
}

export default App;