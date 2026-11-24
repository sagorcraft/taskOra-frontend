import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import Field from "../components/Field.jsx";
import Notice from "../components/Notice.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { validateRegistration } from "../utils/validation.js";

const TERMS_MESSAGE = "You must accept the Terms of Service and Privacy Policy to create an account.";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    const found = validateRegistration({ ...form, email: form.email.trim() });
    setErrors(found);
    setTermsError(termsAccepted ? "" : TERMS_MESSAGE);
    if (Object.keys(found).length || !termsAccepted) return;
    setLoading(true);
    try {
      await register(form);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="Start organizing your work with taskOra." footer={<>Already have an account? <Link to="/login">Sign in</Link></>}>
      <form onSubmit={submit} className="form-stack" noValidate>
        <Notice>{error}</Notice>
        <Field label="Full name" name="fullname" placeholder="Your full name" value={form.fullname} onChange={change} error={errors.fullname} autoComplete="name" />
        <Field label="Email address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={change} error={errors.email} autoComplete="email" />
        <PasswordInput label="Password" name="password" placeholder="At least 8 characters" value={form.password} onChange={change} error={errors.password} autoComplete="new-password" />
        <PasswordInput label="Confirm password" name="confirmPassword" placeholder="Re-enter your password" value={form.confirmPassword} onChange={change} error={errors.confirmPassword} autoComplete="new-password" />
        <div className={`terms-field ${termsError ? "terms-invalid" : ""}`}>
          <label className="terms-check">
            <input type="checkbox" checked={termsAccepted} onChange={e => { setTermsAccepted(e.target.checked); if (e.target.checked) setTermsError(""); }} />
            <span>I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.</span>
          </label>
          {termsError && <small className="error-text terms-error" role="alert">{termsError}</small>}
        </div>
        <button className="btn btn-primary full" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
        <p className="demo-hint">Demo OTP verification uses code <b>123456</b>. No email is sent.</p>
      </form>
    </AuthCard>
  );
}
