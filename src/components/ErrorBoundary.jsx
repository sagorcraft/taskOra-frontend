import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="auth-shell">
        <section className="auth-card error-card" role="alert">
          <div className="auth-heading"><h1>Something went wrong</h1><p>An unexpected error occurred. Your data is safe — reload the page to continue.</p></div>
          <button className="btn btn-primary full" onClick={() => window.location.reload()}>Reload page</button>
        </section>
      </main>
    );
  }
}
