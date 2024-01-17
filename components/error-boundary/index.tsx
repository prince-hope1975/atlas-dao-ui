import React, { PropsWithChildren } from "react";

class ErrorBoundary extends React.Component {
  constructor(props: PropsWithChildren) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  // @ts-ignore
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  // @ts-ignore
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.error({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    // @ts-ignore

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="h-full w-full flex items-center justify-center">
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      );
    }

    // Return children components in case of no error
    // @ts-ignore

    return this.props.children;
  }
}

export default ErrorBoundary;
