export default function Avatar({ user, size = "normal" }) {
  if (user?.avatar) return <img className={`avatar ${size}`} src={user.avatar} alt={`${user.fullname || "User"} profile`} />;
  return <div className={`avatar avatar-fallback ${size}`} aria-hidden="true">{user?.fullname?.slice(0, 1)?.toUpperCase() || "U"}</div>;
}
