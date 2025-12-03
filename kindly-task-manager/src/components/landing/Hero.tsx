import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background -z-10" />
      
      <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Check className="w-4 h-4" />
          Minimal task surface for busy minds
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-tight">
          Focus on what
          <br />
          <span className="text-primary">matters most</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          A distraction-free task app with secure authentication, 
          a clean dashboard, and fast CRUD for your daily tasks.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="hero" size="xl">
            <Link to="/register">
              Get started free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button asChild variant="hero-outline" size="xl">
            <Link to="/login">
              Sign in
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <p className="text-sm text-muted-foreground pt-4">
          No credit card required • Free forever for personal use
        </p>
      </div>
    </section>
  );
}
