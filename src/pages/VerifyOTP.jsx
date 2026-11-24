import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import Notice from "../components/Notice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
export default function VerifyOTP() {
  const { pending, verifyRegistration } = useAuth(), navigate = useNavigate();
  const [code, setCode] = useState(""), [seconds, setSeconds] = useState(60), [error, setError] = useState(""), [success, setSuccess] = useState("");
  useEffect(() => { if (seconds <= 0) return; const timer = setTimeout(() => setSeconds(s => s - 1), 1000); return () => clearTimeout(timer); }, [seconds]);
  const verify = async e => { e.preventDefault(); setError(""); try { await verifyRegistration(code); navigate("/dashboard"); } catch (err) { setError(err.message); } };
  if (!pending) return <AuthCard title="No pending verification" subtitle="Register first to receive a demo verification step." footer={<Link to="/register">Go to registration</Link>}/>;
  return <AuthCard title="Verify your email" subtitle={`Enter the 6-digit code for ${pending.email}.`} footer={<>Wrong email? <Link to="/register">Register again</Link></>}>
    <form onSubmit={verify} className="form-stack">
      <Notice>{error}</Notice><Notice type="success">{success}</Notice>
      <label className="field"><span>6-digit verification code</span><input className="input otp-input" inputMode="numeric" maxLength="6" placeholder="000000" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}/></label>
      <p className="demo-hint">Your demo OTP is <b>123456</b>.</p>
      <button className="btn btn-primary full" disabled={code.length !== 6}>Verify and continue</button>
      <button type="button" className="text-button" disabled={seconds > 0} onClick={() => { setSeconds(60); setSuccess("Demo OTP refreshed: 123456"); }}>{seconds > 0 ? `Resend code in 00:${String(seconds).padStart(2,"0")}` : "Resend OTP"}</button>
    </form>
  </AuthCard>;
}
