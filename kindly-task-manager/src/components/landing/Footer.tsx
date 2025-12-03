import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-medium">K</span>
          </div>
          <span className="font-medium">KindlyTasks</span>
        </div>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/login" className="hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="hover:text-foreground transition-colors">
            Get started
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} KindlyTasks
        </p>
      </div>
    </footer>
  );
}
