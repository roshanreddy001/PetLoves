import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  // Update the componentDidCatch method:
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log these to an error reporting service
    console.error('Error caught by boundary:', error, info);
    this.setState({ hasError: true });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 24, fontWeight: 'bold' }}>
          Something went wrong. Please try again or contact support.<br />
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
