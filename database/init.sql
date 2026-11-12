
CREATE DATABASE IF NOT EXISTS taskmanager;

USE taskmanager;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, completed)
SELECT 'Learn Docker', FALSE
WHERE NOT EXISTS (
    SELECT 1 FROM tasks WHERE title = 'Learn Docker'
);

INSERT INTO tasks (title, completed)
SELECT 'Learn Jenkins', FALSE
WHERE NOT EXISTS (
    SELECT 1 FROM tasks WHERE title = 'Learn Jenkins'
);