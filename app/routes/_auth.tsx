import { useRouteError } from '@remix-run/react';

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className='auth error'>
      <h2>
        {error.status} {error.statusText}
      </h2>
      <h3>{error.data}</h3>
    </div>
  );
}
