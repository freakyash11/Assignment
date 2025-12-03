import { Zap, Shield, Layout, Keyboard } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning fast',
    description: 'Quick-add tasks with a single keystroke. No friction, just flow.',
  },
  {
    icon: Shield,
    title: 'Secure by default',
    description: 'JWT authentication with encrypted passwords. Your data stays yours.',
  },
  {
    icon: Layout,
    title: 'Clean interface',
    description: 'Whitespace-first design. Focus on tasks, not chrome.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard friendly',
    description: 'Navigate, create, and complete tasks without touching your mouse.',
  },
];

export function Features() {
  return (
    <section className="py-24 px-6 bg-card/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-medium tracking-tight mb-4">
            Built for focus
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every feature designed to reduce friction and help you stay in the zone.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-lg bg-background border border-border/50 hover:border-border hover:shadow-sm transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
