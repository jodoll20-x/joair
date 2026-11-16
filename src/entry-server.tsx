import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { ROUTES_SEO } from './seo';

export { ROUTES_SEO };

export function render(url: string): string {
  return renderToString(<App initialPath={url} />);
}
