import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ label, error, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="field">
      <span>{label}</span>
      <div className="password-wrap">
        <input {...props} type={visible ? "text" : "password"} className={error ? "input input-error" : "input"} aria-invalid={Boolean(error)} />
        <button type="button" className="icon-button" onClick={() => setVisible(value => !value)} aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <small className="error-text" role="alert">{error}</small>}
    </label>
  );
}
