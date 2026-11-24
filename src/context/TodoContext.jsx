import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const TodoContext = createContext(null);
const storageKey = userId => `taskora_todos_${userId}`;

function loadTodos(userId) {
  if (!userId) return [];
  try { return JSON.parse(localStorage.getItem(storageKey(userId))) ?? []; }
  catch { return []; }
}

export function TodoProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [store, setStore] = useState(() => ({ ownerId: userId, items: loadTodos(userId) }));

  // Immediately expose an empty list if the active account changes; never show another account's state.
  const todos = store.ownerId === userId && userId ? store.items : [];

  useEffect(() => {
    setStore({ ownerId: userId, items: loadTodos(userId) });
  }, [userId]);

  useEffect(() => {
    if (!userId || store.ownerId !== userId) return;
    try { localStorage.setItem(storageKey(userId), JSON.stringify(store.items)); }
    catch { window.alert("Browser storage is full. Try using a smaller image on your task."); }
  }, [userId, store]);

  const updateItems = updater => {
    if (!userId) return;
    setStore(current => {
      const currentItems = current.ownerId === userId ? current.items : loadTodos(userId);
      return { ownerId: userId, items: updater(currentItems) };
    });
  };

  const addTodo = data => updateItems(current => [{
    id: crypto.randomUUID(),
    title: data.title.trim(),
    description: data.description.trim(),
    categoryId: data.categoryId,
    dueDate: data.dueDate,
    image: data.image || "",
    completed: false,
    createdAt: new Date().toISOString()
  }, ...current]);

  const updateTodo = (id, updates) => updateItems(current =>
    current.map(todo => todo.id === id ? { ...todo, ...updates, title: updates.title?.trim() ?? todo.title } : todo)
  );

  const deleteTodo = id => updateItems(current => current.filter(todo => todo.id !== id));
  const toggleTodo = id => updateItems(current => current.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));

  return <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo, toggleTodo }}>
    {children}
  </TodoContext.Provider>;
}
export const useTodos = () => useContext(TodoContext);
