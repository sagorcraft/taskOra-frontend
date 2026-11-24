export default function Notice({ type = "error", children }) {
  if (!children) return null;
  return <div className={`notice ${type}`} role={type === "error" ? "alert" : "status"}>{children}</div>;
}
