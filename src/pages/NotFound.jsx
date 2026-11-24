import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function NotFound() {
  const { user } = useAuth();
  return (
    <AuthCard
      title="Page not found"
      subtitle="The page you are looking for does not exist or has moved."
      footer={<Link to={user ? "/dashboard" : "/login"}>{user ? "Back to dashboard" : "Back to sign in"}</Link>}
    />
  );
}
