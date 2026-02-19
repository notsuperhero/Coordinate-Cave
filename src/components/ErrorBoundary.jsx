import React from 'react';
import './ErrorBoundary.css';

/**
 * ErrorBoundary — Class Component that catches JS errors in child components
 * and shows a calm, friendly fallback UI.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary" role="alert" aria-live="assertive">
                    <div className="error-boundary__card">
                        <div className="error-boundary__icon">🦇</div>
                        <h2 className="error-boundary__title">Oops! Something went wrong</h2>
                        <p className="error-boundary__message">
                            Don't worry, explorer! Even caves have surprises sometimes.
                            <br />
                            Let's try going back to the start.
                        </p>
                        <div className="error-boundary__actions">
                            <button
                                className="btn btn--primary"
                                onClick={this.handleReset}
                                aria-label="Try again"
                            >
                                ✨ Try Again
                            </button>
                            <button
                                className="btn btn--secondary"
                                onClick={() => window.location.replace('/')}
                                aria-label="Go back to home page"
                            >
                                🏠 Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
