import { Component, type ErrorInfo, type ReactNode } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

function ErrorFallback({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-bg grid place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-caps text-primary">NovaPlay</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg">Không thể tải nội dung</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-2">{title}</p>
        <p className="mt-2 text-xs leading-relaxed text-fg-3">{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-pill bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Tải Lại
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[NovaPlay] Lỗi render:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title="Một phần giao diện đang gặp lỗi."
          message="Bấm Tải Lại để khởi động lại ứng dụng."
        />
      );
    }

    return this.props.children;
  }
}

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorFallback
        title={`Không tìm thấy hoặc không thể tải trang (${error.status}).`}
        message={error.statusText || 'Vui lòng kiểm tra lại đường dẫn.'}
      />
    );
  }

  const message = error instanceof Error ? error.message : 'Vui lòng thử tải lại trang.';
  return <ErrorFallback title="Route hiện tại đang gặp lỗi." message={message} />;
}
