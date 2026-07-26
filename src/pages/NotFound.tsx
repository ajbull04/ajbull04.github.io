import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md">
        <p className="label-mono text-primary">404</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-foreground">This page was never built.</h1>
        <p className="mt-4 font-body leading-relaxed text-muted-foreground">
          The route <span className="font-mono text-sm">{location.pathname}</span> doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block bg-ink px-6 py-3 font-display text-sm font-semibold text-paper transition-colors hover:bg-primary"
        >
          Back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
