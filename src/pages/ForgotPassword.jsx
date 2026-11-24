import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import Field from "../components/Field.jsx";
import Notice from "../components/Notice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { emailIsValid } from "../utils/validation.js";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const submit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!emailIsValid(email.trim())) return setError("Enter a valid email address.");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccess("If an account exists for this email, a reset code has been generated. Demo code: 123456");
      redirectTimer.current = setTimeout(() => navigate("/reset-password"), 1400);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot password?" subtitle="Enter your account email to start resetting your password." footer={<>Remembered it? <Link to="/login">Back to sign in</Link></>}>
      <form onSubmit={submit} className="form-stack" noValidate>
        <Notice>{error}</Notice>
        <Notice type="success">{success}</Notice>
        <Field label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        <button className="btn btn-primary full" disabled={loading}>{loading ? "Sending…" : "Send reset code"}</button>
      </form>
    </AuthCard>
  );
}
