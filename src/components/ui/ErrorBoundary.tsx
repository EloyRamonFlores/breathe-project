"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

interface ClassProps extends Props {
  errorLabel: string;
  title: string;
  message: string;
  retry: string;
}

class ErrorBoundaryClass extends React.Component<ClassProps, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            {this.props.errorLabel}
          </p>
          <h2 className="text-xl font-bold text-slate-100">
            {this.props.title}
          </h2>
          <p className="max-w-sm text-sm text-slate-400">
            {this.props.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            {this.props.retry}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorBoundary({ children }: Props) {
  const t = useTranslations("errors");
  return (
    <ErrorBoundaryClass
      errorLabel={t("label")}
      title={t("boundary_title")}
      message={t("boundary_message")}
      retry={t("boundary_retry")}
    >
      {children}
    </ErrorBoundaryClass>
  );
}
