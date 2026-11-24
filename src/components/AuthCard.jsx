import { Link } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle.js";

export default function AuthCard({ title, subtitle, children, footer, backTo }) {
  usePageTitle(title);
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link to="/login" className="brand"><span className="brand-icon"><CheckSquare size={21} /></span>taskOra</Link>
        <div className="auth-heading"><h1>{title}</h1><p>{subtitle}</p></div>
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
        {backTo && <Link className="back-link" to={backTo}>← Back</Link>}
      </section>
      <p className="auth-bottom">© {new Date().getFullYear()} taskOra. Make space for what matters.</p>
    </main>
  );
}
