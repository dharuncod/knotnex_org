import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (window.location) {
      window.location.hash = '';
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '40px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            fontFamily: 'inherit'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FEE4E2',
              color: '#D92D20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              fontSize: '28px'
            }}
          >
            ⚠️
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px', color: '#101828' }}>
            Something went wrong rendering this view
          </h2>
          <p style={{ fontSize: '14px', color: '#667085', maxWidth: '480px', margin: '0 0 24px', lineHeight: 1.5 }}>
            {this.state.error?.message || 'An unexpected rendering error occurred. You can return to the dashboard or refresh the page.'}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={this.handleReset}
              className="btn-primary"
              style={{
                height: '40px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: 600,
                background: '#6336EB',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onNavigateDashboard) {
                  this.props.onNavigateDashboard();
                } else {
                  window.location.reload();
                }
              }}
              className="btn-secondary"
              style={{
                height: '40px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid #D0D5DD',
                background: '#FFFFFF',
                color: '#344054',
                cursor: 'pointer'
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
