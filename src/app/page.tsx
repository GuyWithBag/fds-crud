// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "./firebase"; // Adjust path if needed
import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	doc,
} from "firebase/firestore";

interface Task {
	id: string;
	title: string;
	completed: boolean;
}

export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTask, setNewTask] = useState("");
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	// Fetch tasks from Firestore
	const fetchTasks = async () => {
		const querySnapshot = await getDocs(collection(db, "tasks"));
		const tasksData: Task[] = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Task[];
		setTasks(tasksData);
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	// Create a new task
	const handleAddTask = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTask.trim()) return;

		await addDoc(collection(db, "tasks"), {
			title: newTask,
			completed: false,
		});
		setNewTask("");
		fetchTasks();
	};

	// Update a task
	const handleUpdateTask = async (task: Task) => {
		if (!editingTask) return;
		const taskRef = doc(db, "tasks", task.id);
		await updateDoc(taskRef, {
			title: editingTask.title,
			completed: task.completed,
		});
		setEditingTask(null);
		fetchTasks();
	};

	// Toggle task completion
	const toggleTaskCompletion = async (task: Task) => {
		const taskRef = doc(db, "tasks", task.id);
		await updateDoc(taskRef, { completed: !task.completed });
		fetchTasks();
	};

	// Delete a task
	const handleDeleteTask = async (id: string) => {
		await deleteDoc(doc(db, "tasks", id));
		fetchTasks();
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
				{/* Header */}
				<h1 className="text-2xl font-semibold text-gray-800 mb-6">Tasks</h1>

				{/* Add Task Form */}
				<form onSubmit={handleAddTask} className="mb-6">
					<div className="flex gap-2">
						<input
							type="text"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							placeholder="Add a new task"
							className="flex-1 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
						>
							Add
						</button>
					</div>
				</form>

				{/* Task List */}
				<ul className="space-y-4">
					{tasks.map((task) => (
						<li
							key={task.id}
							className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition"
						>
							{editingTask?.id === task.id ? (
								<input
									type="text"
									value={editingTask.title}
									onChange={(e) =>
										setEditingTask({ ...editingTask, title: e.target.value })
									}
									className="flex-1 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							) : (
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={task.completed}
										onChange={() => toggleTaskCompletion(task)}
										className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
									/>
									<span
										className={`text-gray-800 ${
											task.completed ? "line-through text-gray-500" : ""
										}`}
									>
										{task.title}
									</span>
								</div>
							)}

							<div className="flex gap-2">
								{editingTask?.id === task.id ? (
									<button
										onClick={() => handleUpdateTask(task)}
										className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
									>
										Save
									</button>
								) : (
									<button
										onClick={() => setEditingTask(task)}
										className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
									>
										Edit
									</button>
								)}
								<button
									onClick={() => handleDeleteTask(task.id)}
									className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
								>
									Delete
								</button>
							</div>
						</li>
					))}
					{tasks.length === 0 && (
						<p className="text-gray-500 text-center">No tasks yet.</p>
					)}
				</ul>
			</div>
		</div>
	);
}
