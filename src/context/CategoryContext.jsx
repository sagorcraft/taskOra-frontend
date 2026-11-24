import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CategoryContext = createContext(null);
const storageKey = userId => `taskora_categories_${userId}`;
const starter = [
  { id: "work", name: "Work", color: "#7770e8", icon: "Briefcase" },
  { id: "personal", name: "Personal", color: "#28a6cf", icon: "User" },
  { id: "learning", name: "Learning", color: "#e8a63b", icon: "BookOpen" }
];

function loadCategories(userId) {
  if (!userId) return [];
  try {
    const saved = localStorage.getItem(storageKey(userId));
    return saved ? JSON.parse(saved) : starter;
  } catch { return starter; }
}

export function CategoryProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [store, setStore] = useState(() => ({ ownerId: userId, items: loadCategories(userId) }));
  const categories = store.ownerId === userId && userId ? store.items : [];

  useEffect(() => {
    setStore({ ownerId: userId, items: loadCategories(userId) });
  }, [userId]);

  useEffect(() => {
    if (!userId || store.ownerId !== userId) return;
    localStorage.setItem(storageKey(userId), JSON.stringify(store.items));
  }, [userId, store]);

  const updateItems = updater => {
    if (!userId) return;
    setStore(current => {
      const currentItems = current.ownerId === userId ? current.items : loadCategories(userId);
      return { ownerId: userId, items: updater(currentItems) };
    });
  };

  const addCategory = item => updateItems(current => [...current, { ...item, id: crypto.randomUUID() }]);
  const updateCategory = (id, updates) => updateItems(current => current.map(item => item.id === id ? { ...item, ...updates } : item));
  const deleteCategory = id => updateItems(current => current.filter(item => item.id !== id));
  return <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>{children}</CategoryContext.Provider>;
}
export const useCategories = () => useContext(CategoryContext);
