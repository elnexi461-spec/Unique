import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isRepairing: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isRepairing: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true, isRepairing: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    setTimeout(() => {
      this.setState({ isRepairing: false });
    }, 3000);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, isRepairing: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {this.state.isRepairing ? (
              <motion.div
                key="repairing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center gap-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-4 border-primary/30 border-t-primary"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full blur-xl" />
                  </div>
                </div>
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-primary font-mono text-lg"
                >
                  Self-Repairing System...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="failed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-6 p-8 rounded-2xl bg-card border border-border max-w-md text-center shadow-2xl"
              >
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" x2="12" y1="9" y2="13" />
                    <line x1="12" x2="12.01" y1="17" y2="17" />
                  </svg>

                </div>
                <h2 className="text-xl font-semibold">Critical System Failure</h2>
                <p className="text-muted-foreground text-sm">
                  The interface encountered an unexpected anomaly. Auto-repair failed. Please initialize manual override.
                </p>
                <Button onClick={this.handleRetry} variant="default" className="w-full mt-4">
                  Reboot Interface
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return this.props.children;
  }
}
