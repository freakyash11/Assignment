import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-card/50 to-background">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium">K</span>
          </div>
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {/* Form */}
        <div className="bg-background p-6 rounded-lg border border-border/50 shadow-sm">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          {footerText}{' '}
          <Link to={footerLinkTo} className="text-primary hover:underline font-medium">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
