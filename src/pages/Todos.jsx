import { useMemo, useRef, useState } from "react";
import { CalendarDays, Check, ImagePlus, ListTodo, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useTodos } from "../context/TodoContext.jsx";
import { useCategories } from "../context/CategoryContext.jsx";
import Notice from "../components/Notice.jsx";

const emptyForm = { title: "", description: "", categoryId: "", dueDate: "", image: "" };

export default function Todos() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos();
  const { categories } = useCategories();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const fileRef = useRef(null);

  const visibleTodos = useMemo(() => todos.filter(todo => {
    const matchesFilter = filter === "all" || (filter === "active" ? !todo.completed : todo.completed);
    const matchesSearch = `${todo.title} ${todo.description}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [todos, filter, search]);

  const reset = () => { setForm(emptyForm); setEditingId(null); setError(""); if (fileRef.current) fileRef.current.value = ""; };

  const handleImage = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Task image must be JPG, PNG or WEBP."); event.target.value = ""; return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Task image must be smaller than 2 MB."); event.target.value = ""; return;
    }
    const reader = new FileReader();
    reader.onload = () => { setForm(current => ({ ...current, image: reader.result })); setError(""); };
    reader.readAsDataURL(file);
  };

  const submit = event => {
    event.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Please enter a task title.");
    if (editingId) updateTodo(editingId, form);
    else addTodo(form);
    reset();
  };

  const edit = todo => {
    setEditingId(todo.id);
    setForm({ title: todo.title, description: todo.description || "", categoryId: todo.categoryId || "", dueDate: todo.dueDate || "", image: todo.image || "" });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categoryName = id => categories.find(category => category.id === id)?.name || "Uncategorized";

  return <div className="content-wrap">
    <div className="page-title-row">
      <div><p className="eyebrow">PLAN YOUR DAY</p><h1>My Todos</h1><p className="muted">Capture tasks, track progress and keep moving forward.</p></div>
      <div className="todo-count-chip"><b>{todos.filter(todo => !todo.completed).length}</b> active <span>·</span> {todos.filter(todo => todo.completed).length} completed</div>
    </div>

    <div className="todos-layout">
      <section className="panel todo-form-panel">
        <div className="panel-heading"><div><h2>{editingId ? "Update task" : "Add a new task"}</h2><p className="muted">{editingId ? "Edit the task details below." : "What would you like to get done?"}</p></div>{editingId && <button className="icon-button" onClick={reset} aria-label="Cancel edit"><X size={18}/></button>}</div>
        <form className="form-stack" onSubmit={submit}>
          <Notice>{error}</Notice>
          <label className="field"><span>Task title *</span><input className="input" autoFocus placeholder="e.g. Finish project presentation" value={form.title} onChange={e => setForm({...form,title:e.target.value})} maxLength={100}/></label>
          <label className="field"><span>Description</span><textarea className="input todo-textarea" placeholder="Add some details about this task…" value={form.description} onChange={e => setForm({...form,description:e.target.value})} rows={3}/></label>
          <div className="todo-form-row">
            <label className="field"><span>Category</span><select className="input" value={form.categoryId} onChange={e => setForm({...form,categoryId:e.target.value})}><option value="">No category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="field"><span>Due date</span><input className="input" type="date" value={form.dueDate} onChange={e => setForm({...form,dueDate:e.target.value})}/></label>
          </div>
          <div className="field"><span>Task image (optional)</span>
            <input ref={fileRef} type="file" hidden accept="image/png,image/jpeg,image/webp" onChange={handleImage}/>
            {form.image ? <div className="todo-image-preview"><img src={form.image} alt="Task attachment preview"/><button type="button" className="remove-image" onClick={() => {setForm({...form,image:""}); if(fileRef.current) fileRef.current.value="";}}><X size={15}/> Remove image</button><button type="button" className="change-image" onClick={() => fileRef.current?.click()}>Change</button></div> : <button type="button" className="upload-dropzone" onClick={() => fileRef.current?.click()}><ImagePlus size={21}/><span><b>Click to upload an image</b><small>JPG, PNG or WEBP · Max 2 MB</small></span></button>}
          </div>
          <button className="btn btn-primary full"><Plus size={17}/>{editingId ? "Save task changes" : "Add task"}</button>
          {editingId && <button type="button" className="btn btn-ghost full" onClick={reset}>Cancel</button>}
        </form>
      </section>

      <section className="panel todo-list-panel">
        <div className="panel-heading"><div><h2>Your task list</h2><p className="muted">{todos.length} total {todos.length === 1 ? "task" : "tasks"}</p></div><span className="todo-list-icon"><ListTodo size={19}/></span></div>
        <div className="todo-toolbar"><div className="todo-search"><Search size={16}/><input placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)}/></div><div className="todo-filters">{["all","active","completed"].map(item => <button key={item} className={filter===item?"selected":""} onClick={() => setFilter(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div></div>
        {visibleTodos.length ? <div className="todo-items">{visibleTodos.map(todo => <article className={`todo-item ${todo.completed?"is-complete":""}`} key={todo.id}>
          <button className={`todo-check ${todo.completed?"checked":""}`} onClick={() => toggleTodo(todo.id)} aria-label={todo.completed?"Mark as active":"Mark as completed"}>{todo.completed && <Check size={14}/>}</button>
          <div className="todo-item-main"><div className="todo-item-title-row"><h3>{todo.title}</h3><div className="todo-item-actions"><button className="icon-button" onClick={() => edit(todo)} aria-label="Edit task"><Pencil size={15}/></button><button className="icon-button danger-hover" onClick={() => { if (window.confirm("Delete this task?")) deleteTodo(todo.id); }} aria-label="Delete task"><Trash2 size={15}/></button></div></div>
            {todo.description && <p className="todo-description">{todo.description}</p>}
            <div className="todo-meta"><span className="todo-category-label">{categoryName(todo.categoryId)}</span>{todo.dueDate && <span><CalendarDays size={12}/> {new Date(`${todo.dueDate}T00:00:00`).toLocaleDateString()}</span>}</div>
            {todo.image && <img className="todo-attachment" src={todo.image} alt={`Attachment for ${todo.title}`}/>}
          </div>
        </article>)}</div> : <div className="empty-state todo-empty"><span><ListTodo size={27}/></span><h3>{todos.length ? "No matching tasks" : "No tasks yet"}</h3><p>{todos.length ? "Try another search or filter." : "Add your first task using the form. You can attach an image too."}</p></div>}
      </section>
    </div>
  </div>;
}
