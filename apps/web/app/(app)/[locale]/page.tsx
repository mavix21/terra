import { IconBrandGithub, IconRocket } from "@tabler/icons-react";

import { Button } from "@terra/ui/components/button";

import { DynamicWidget } from "@/lib/dynamic";
import { ThemeSwitcher } from "@/shared/ui/theme-switcher";

import { SessionView } from "../_ui/session-view";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 border-b px-4 backdrop-blur">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <IconRocket className="size-6" />
            <span className="text-xl font-bold">Next.js Monorepo</span>
          </div>
          <div className="flex items-center gap-2">
            <DynamicWidget />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto pt-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center space-y-8 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Next.js Monorepo Template
          </h1>
          <SessionView />
          <p className="text-muted-foreground max-w-[42rem] sm:text-xl">
            A modern, scalable template for building full-stack applications
            with Next.js, featuring a monorepo structure and beautiful UI
            components.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="gap-2">
              <IconRocket className="size-4" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <IconBrandGithub className="size-4" />
              GitHub
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm"
              >
                <feature.icon className="text-primary size-10" />
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-2">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Next.js Monorepo Template. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Monorepo Structure",
    description:
      "Efficiently manage multiple packages and applications in a single repository.",
    icon: IconRocket,
  },
  {
    title: "Modern UI",
    description:
      "Beautiful and responsive UI components built with Tailwind CSS.",
    icon: IconRocket,
  },
  {
    title: "Type Safety",
    description: "Full TypeScript support for better development experience.",
    icon: IconRocket,
  },
];
