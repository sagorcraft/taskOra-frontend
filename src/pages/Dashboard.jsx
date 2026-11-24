import { useMemo, useRef, useState } from "react";
import {
  ArrowRight, CalendarDays, Camera, CheckCircle2, Circle, Clock3, FolderKanban,
  ListTodo, Plus, Sparkles, Target, TrendingUp, Trash2, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCategories } from "../context/CategoryContext.jsx";
import { useTodos } from "../context/TodoContext.jsx";
import Avatar from "../components/Avatar.jsx";
import Notice from "../components/Notice.jsx";

const dateLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" });
const shortDate = value => new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(value);

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const { categories } = useCategories();
  const { todos } = useTodos();
  const fileRef = useRef(null);
  const [message, setMessage] = useState("");

  const completed = todos.filter(todo => todo.completed).length;
  const active = todos.length - completed;
  const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = useMemo(() => todos
    .filter(todo => !todo.completed && todo.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4), [todos]);
  const recent = useMemo(() => [...todos]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5), [todos]);

  const upload = event => {
    const file = event.target.files?.[0]; if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setMessage("Choose a JPG, PNG or WEBP image."); return; }
    if (file.size > 2 * 1024 * 1024) { setMessage("Image must be smaller than 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { updateProfile({ avatar: reader.result }); setMessage("Profile image updated."); };
    reader.readAsDataURL(file);
  };

  const categoryName = id => categories.find(category => category.id === id)?.name || "Uncategorized";

  return <div className="content-wrap overview-page">
    <section className="overview-hero">
      <div className="overview-hero-copy">
        <p className="eyebrow"><Sparkles size={13}/> YOUR PERSONAL WORKSPACE</p>
        <h1>Welcome back, {user?.fullname?.split(" ")[0] || "there"}<span className="hero-period">.</span></h1>
        <p>Small steps make meaningful progress. Here's your day at a glance.</p>
        <div className="hero-actions">
          <Link to="/todos" className="btn btn-primary"><Plus size={17}/> Create a task</Link>
          <Link to="/categories" className="overview-secondary-link">Explore categories <ArrowRight size={15}/></Link>
        </div>
      </div>
      <div className="overview-hero-aside">
        <div className="hero-date-icon"><CalendarDays size={19}/></div>
        <span>Today</span>
        <strong>{dateLabel.format(new Date())}</strong>
        <small>Make it a productive one</small>
      </div>
      <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
    </section>

    <section className="overview-stat-grid" aria-label="Task summary">
      <article className="overview-stat-card">
        <div className="overview-stat-top"><span className="overview-stat-icon stat-violet"><ListTodo size={19}/></span><span className="stat-trend"><TrendingUp size={13}/> Your tasks</span></div>
        <strong>{todos.length}</strong><p>Total tasks</p><small>{active} waiting for you</small>
      </article>
      <article className="overview-stat-card">
        <div className="overview-stat-top"><span className="overview-stat-icon stat-green"><CheckCircle2 size={19}/></span><span className="stat-trend">Great work</span></div>
        <strong>{completed}</strong><p>Completed</p><small>Tasks you've finished</small>
      </article>
      <article className="overview-stat-card">
        <div className="overview-stat-top"><span className="overview-stat-icon stat-blue"><Clock3 size={19}/></span><span className="stat-trend">In progress</span></div>
        <strong>{active}</strong><p>Still active</p><small>Keep the momentum going</small>
      </article>
      <article className="overview-stat-card">
        <div className="overview-stat-top"><span className="overview-stat-icon stat-amber"><FolderKanban size={19}/></span><span className="stat-trend">Organized</span></div>
        <strong>{categories.length}</strong><p>Categories</p><small>Your personal spaces</small>
      </article>
    </section>

    <section className="overview-main-grid">
      <article className="panel overview-progress-panel">
        <div className="overview-section-heading">
          <div><span className="section-kicker">YOUR MOMENTUM</span><h2>Progress overview</h2><p className="muted">Every completed task is a step forward.</p></div>
          <span className="progress-target"><Target size={17}/></span>
        </div>
        <div className="progress-summary"><div><strong>{progress}%</strong><span>completion rate</span></div><span className="progress-count">{completed} of {todos.length} tasks done</span></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }}/></div>
        <div className="progress-foot"><span><i className="progress-dot done-dot"/> Completed <b>{completed}</b></span><span><i className="progress-dot active-dot"/> Remaining <b>{active}</b></span></div>
        {!todos.length && <div className="progress-empty"><Zap size={16}/> Add your first task to start tracking your progress.</div>}
      </article>

      <article className="panel overview-profile-panel">
        <div className="overview-section-heading"><div><span className="section-kicker">ACCOUNT</span><h2>Your profile</h2></div><span className="profile-status">Active</span></div>
        <div className="overview-profile">
          <div className="overview-avatar-wrap"><Avatar user={user} size="large"/><button className="overview-camera" onClick={() => fileRef.current?.click()} title="Change profile photo"><Camera size={14}/></button></div>
          <div className="overview-profile-info"><strong>{user?.fullname}</strong><span>{user?.email}</span><button onClick={() => fileRef.current?.click()}>Update photo <ArrowRight size={13}/></button></div>
        </div>
        <input ref={fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={upload}/>
        <Notice type="success">{message}</Notice>
        {user?.avatar && <button className="remove-photo" onClick={() => { updateProfile({ avatar: "" }); setMessage("Profile image removed."); }}><Trash2 size={14}/> Remove photo</button>}
        <small className="helper-text">JPG, PNG or WEBP · Max 2 MB</small>
      </article>
    </section>

    <section className="overview-lower-grid">
      <article className="panel overview-list-panel">
        <div className="overview-section-heading">
          <div><span className="section-kicker">STAY ON TOP</span><h2>Upcoming deadlines</h2><p className="muted">Your next tasks with a due date.</p></div>
          <Link to="/todos" className="overview-view-link">View all <ArrowRight size={14}/></Link>
        </div>
        {upcoming.length ? <div className="overview-task-list">{upcoming.map(todo => {
          const due = new Date(`${todo.dueDate}T00:00:00`); const overdue = due < today;
          return <div className="overview-task-row" key={todo.id}><span className={`overview-task-icon ${overdue ? "overdue" : ""}`}><Circle size={17}/></span><div className="overview-task-copy"><strong>{todo.title}</strong><small>{categoryName(todo.categoryId)}</small></div><span className={`overview-due ${overdue ? "is-overdue" : ""}`}>{overdue ? "Overdue" : shortDate(due)}</span></div>;
        })}</div> : <div className="overview-empty"><CalendarDays size={23}/><strong>No upcoming deadlines</strong><span>Tasks with due dates will appear here.</span></div>}
      </article>

      <article className="panel overview-list-panel">
        <div className="overview-section-heading">
          <div><span className="section-kicker">RECENT ACTIVITY</span><h2>Recently added</h2><p className="muted">A quick look at your latest tasks.</p></div>
          <Link to="/todos" className="overview-view-link">All tasks <ArrowRight size={14}/></Link>
        </div>
        {recent.length ? <div className="overview-task-list">{recent.map(todo => <div className="overview-task-row" key={todo.id}><span className={`overview-task-icon ${todo.completed ? "task-is-done" : ""}`}>{todo.completed ? <CheckCircle2 size={18}/> : <Circle size={17}/>}</span><div className="overview-task-copy"><strong className={todo.completed ? "overview-completed-title" : ""}>{todo.title}</strong><small>{categoryName(todo.categoryId)}</small></div><span className={`overview-task-state ${todo.completed ? "complete-state" : ""}`}>{todo.completed ? "Done" : "Active"}</span></div>)}</div> : <div className="overview-empty"><ListTodo size={23}/><strong>Your task list is clear</strong><span>Create a task and it will show up here.</span><Link to="/todos">Create your first task <ArrowRight size={13}/></Link></div>}
      </article>
    </section>

    <section className="overview-bottom-cta">
      <div className="overview-cta-icon"><Sparkles size={20}/></div><div><strong>Ready for your next win?</strong><p>Turn your ideas into action, one task at a time.</p></div><Link to="/todos" className="btn btn-primary">Go to my tasks <ArrowRight size={15}/></Link>
    </section>
  </div>;
}
