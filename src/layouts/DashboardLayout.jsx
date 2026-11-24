import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckSquare, LayoutDashboard, ListTodo, LogOut, Menu, Moon, Sun, Tags, X } from "lucide-react";
import Avatar from "../components/Avatar.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_LINKS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/todos", label: "My Todos", icon: ListTodo }
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const pageLabel = NAV_LINKS.find(link => link.to === pathname)?.label || "Overview";
  usePageTitle(pageLabel);

  const signOut = () => { logout(); navigate("/login"); };

  return (
    <div className="app-shell">
      {open && <button className="mobile-scrim" onClick={() => setOpen(false)} aria-label="Close menu" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-icon"><CheckSquare size={21} /></span>taskOra
          <button className="icon-button mobile-close" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
        </div>
        <p className="nav-caption">WORKSPACE</p>
        <nav aria-label="Main">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <Icon size={19} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-mini"><Avatar user={user} /><div><b>{user?.fullname}</b><small>{user?.email}</small></div></div>
          <button className="nav-link logout" onClick={signOut}><LogOut size={18} />Log out</button>
        </div>
      </aside>
      <section className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <div className="topbar-label">Workspace <span>/</span> <b>{pageLabel}</b></div>
          <div className="topbar-actions">
            <button className="icon-button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} title="Toggle theme">
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Avatar user={user} />
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
      </section>
    </div>
  );
}
