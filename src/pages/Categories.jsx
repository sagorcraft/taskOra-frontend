import { useState } from "react";
import { BookOpen, Briefcase, Folder, Heart, Plus, Tag, Trash2, User, X, Pencil } from "lucide-react";
import { useCategories } from "../context/CategoryContext.jsx";
import Notice from "../components/Notice.jsx";
const icons = { Folder, Briefcase, BookOpen, User, Heart, Tag };
const colors = ["#6366f1","#0ea5e9","#14b8a6","#f59e0b","#ef4444","#ec4899","#8b5cf6","#64748b"];
export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editing, setEditing] = useState(null), [name, setName] = useState(""), [color, setColor] = useState(colors[0]), [icon, setIcon] = useState("Folder"), [error, setError] = useState("");
  const reset = () => { setEditing(null); setName(""); setColor(colors[0]); setIcon("Folder"); setError(""); };
  const openEdit = item => { setEditing(item.id); setName(item.name); setColor(item.color); setIcon(item.icon || "Folder"); setError(""); };
  const submit = e => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError("Category name is required.");
    const duplicate = categories.some(item => item.name.toLowerCase() === trimmed.toLowerCase() && item.id !== editing);
    if (duplicate) return setError("A category with this name already exists.");
    if (editing) updateCategory(editing, { name: trimmed, color, icon });
    else addCategory({ name: trimmed, color, icon });
    reset();
  };
  const remove = item => {
    if (window.confirm(`Delete "${item.name}"? Tasks in this category will become uncategorized.`)) {
      deleteCategory(item.id);
      if (editing === item.id) reset();
    }
  };
  return <div className="content-wrap">
    <div className="page-title-row"><div><p className="eyebrow">ORGANIZE YOUR WORK</p><h1>Categories</h1><p className="muted">Create colorful spaces to group your tasks.</p></div><button className="btn btn-primary" onClick={() => { reset(); document.getElementById("category-name")?.focus(); }}><Plus size={17}/> Add category</button></div>
    <div className="categories-layout">
      <section className="panel"><div className="panel-heading"><div><h2>All categories</h2><p className="muted">{categories.length} {categories.length === 1 ? "category" : "categories"} in your workspace</p></div></div>
        {categories.length ? <div className="category-grid">{categories.map(item => { const Icon = icons[item.icon] || Folder; return <article className="category-card" key={item.id}><div className="category-card-top"><span className="category-icon" style={{background:`${item.color}18`,color:item.color}}><Icon size={21}/></span><div className="card-actions"><button className="icon-button" onClick={() => openEdit(item)} aria-label={`Edit ${item.name}`}><Pencil size={16}/></button><button className="icon-button danger-hover" onClick={() => remove(item)} aria-label={`Delete ${item.name}`}><Trash2 size={16}/></button></div></div><h3>{item.name}</h3><p className="muted">Task category</p><div className="category-color-line" style={{background:item.color}}/></article>; })}</div> : <div className="empty-state"><span><Folder size={27}/></span><h3>No categories yet</h3><p>Create your first category to organize your tasks.</p><button className="btn btn-primary" onClick={() => document.getElementById("category-name")?.focus()}><Plus size={17}/> Create category</button></div>}
      </section>
      <section className="panel category-form-panel"><div className="panel-heading"><div><h2>{editing ? "Edit category" : "New category"}</h2><p className="muted">{editing ? "Update the details below." : "Give your category a name and style."}</p></div>{editing && <button className="icon-button" onClick={reset} aria-label="Cancel edit"><X size={18}/></button>}</div>
        <form onSubmit={submit} className="form-stack"><Notice>{error}</Notice><label className="field"><span>Category name</span><input id="category-name" className="input" placeholder="e.g. Personal projects" value={name} onChange={e => setName(e.target.value)} maxLength={32}/></label>
          <label className="field"><span>Choose a color</span><div className="color-options">{colors.map(c => <button type="button" key={c} className={`color-swatch ${color===c?"selected":""}`} style={{background:c}} onClick={() => setColor(c)} aria-label={`Select ${c}`}/>)}</div></label>
          <label className="field"><span>Choose an icon</span><div className="icon-options">{Object.entries(icons).map(([key, Icon]) => <button type="button" key={key} className={`icon-choice ${icon===key?"selected":""}`} onClick={() => setIcon(key)} aria-label={key}><Icon size={19}/></button>)}</div></label>
          <div className="preview-label">PREVIEW</div><div className="category-preview-box"><span className="category-icon" style={{background:`${color}18`,color}}>{(() => { const Icon=icons[icon]||Folder; return <Icon size={20}/>; })()}</span><b>{name.trim() || "Category name"}</b></div>
          <button className="btn btn-primary full">{editing ? "Save changes" : "Create category"}</button>
          {editing && <button type="button" className="btn btn-ghost full" onClick={reset}>Cancel</button>}
        </form>
      </section>
    </div>
  </div>;
}
