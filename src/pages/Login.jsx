import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import Field from "../components/Field.jsx";
import Notice from "../components/Notice.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { emailIsValid } from "../utils/validation.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const redirectTo = useLocation().state?.from?.pathname || "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (!emailIsValid(form.email.trim()) || !form.password) return setError("Enter a valid email and password.");
    setLoading(true);
    try {
      await login(form.email, form.password, remember);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue to your workspace." footer={<>New to taskOra? <Link to="/register">Create an account</Link></>}>
      <form onSubmit={submit} className="form-stack" noValidate>
        <Notice>{error}</Notice>
        <Field label="Email address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={change} autoComplete="email" />
        <PasswordInput label="Password" name="password" placeholder="Enter your password" value={form.password} onChange={change} autoComplete="current-password" />
        <div className="form-between">
          <label className="check-label auth-check-label"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> <span>Remember me</span></label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="btn btn-primary full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        <p className="demo-hint">Demo mode: create an account first. Registration OTP: <b>123456</b>.</p>
      </form>
    </AuthCard>
  );
}
