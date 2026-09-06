import React from "react";
import { AlertTriangle, Home } from "lucide-react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-card border border-border p-8 rounded-lg shadow-sm max-w-md w-full">
            <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-primary mb-2 font-display">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We encountered an unexpected error. Please try refreshing the page or returning home.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:bg-primary/90"
              >
                Refresh Page
              </button>
              <a 
                href="/" 
                className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-sm text-sm font-medium hover:bg-secondary/80 flex items-center gap-2"
              >
                <Home className="w-4 h-4" /> Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
