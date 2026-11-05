import { useRoutes, useLocation } from "react-router-dom";
import { routes } from "@/app/routes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TransitionProvider } from "@/components/layout/Transition";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";
import { useLenis } from "@/hooks/useLenis";
import { Component, type ReactNode } from "react";
import { finishBoot } from "@/lib/boot";

/** Last line of defence: never leave a visitor on a black screen. */
class AppBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error(error);
    document.getElementById("pre")?.remove();
    finishBoot();
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="crash">
        <p className="head">Something slipped.</p>
        <p className="lead">The page hit an error while loading.</p>
        <button className="btn btn--accent" onClick={() => window.location.reload()}>
          <span className="btn__inner">
            <span className="btn__label">Reload</span>
          </span>
        </button>
      </main>
    );
  }
}

function Shell() {
  const element = useRoutes(routes);
  const { pathname } = useLocation();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" key={pathname}>
        {element}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  useLenis();
  return (
    <AppBoundary>
    <TransitionProvider>
      <Shell />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Preloader />
    </TransitionProvider>
    </AppBoundary>
  );
}
