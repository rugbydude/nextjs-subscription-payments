'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from '@/components/ui/Button/Button';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={cn('p-8 text-center', this.props.className)}>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button
            variant="primary"
            onClick={this.handleReset}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.className ? (
      <div className={this.props.className}>{this.props.children}</div>
    ) : (
      this.props.children
    );
  }
} 