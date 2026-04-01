import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

// Auth is disabled — always render children directly
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
