import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/buttons/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service in production
    if (import.meta.env.PROD) {
      // TODO: Send to error tracking service (e.g., Sentry)
      console.error('Error boundary caught:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Oops!</h1>
              <h2 className="text-xl text-muted-foreground">
                Terjadi kesalahan yang tidak terduga
              </h2>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-left">
                <p className="text-sm font-mono text-destructive break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset} className="w-full sm:w-auto">
                Kembali ke Beranda
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Muat Ulang Halaman
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Jika masalah terus berlanjut, silakan hubungi tim dukungan kami.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
