import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import Field from "../components/Field.jsx";
import Notice from "../components/Notice.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { passwordIsValid } from "../utils/validation.js";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ otp: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const setField = (name, value) => setForm(current => ({ ...current, [name]: value }));

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(form.otp)) return setError("Enter the 6-digit OTP.");
    if (!passwordIsValid(form.password)) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await resetPassword(form.password, form.otp);
      setSuccess("Password updated. Redirecting to sign in…");
      redirectTimer.current = setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset your password" subtitle="Verify the demo code and choose a new password." footer={<Link to="/login">Back to sign in</Link>}>
      <form onSubmit={submit} className="form-stack" noValidate>
        <Notice>{error}</Notice>
        <Notice type="success">{success}</Notice>
        <Field label="6-digit OTP" inputMode="numeric" placeholder="123456" value={form.otp} onChange={e => setField("otp", e.target.value.replace(/\D/g, "").slice(0, 6))} autoComplete="one-time-code" />
        <p className="demo-hint">Demo reset OTP: <b>123456</b>. No email is sent.</p>
        <PasswordInput label="New password" placeholder="At least 8 characters" value={form.password} onChange={e => setField("password", e.target.value)} autoComplete="new-password" />
        <PasswordInput label="Confirm new password" placeholder="Re-enter new password" value={form.confirm} onChange={e => setField("confirm", e.target.value)} autoComplete="new-password" />
        <button className="btn btn-primary full" disabled={loading}>{loading ? "Updating…" : "Verify code & reset password"}</button>
      </form>
    </AuthCard>
  );
}
