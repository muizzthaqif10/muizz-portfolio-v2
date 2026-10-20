import type { Components } from 'react-markdown';
import Link from 'next/link';
import { slugify } from '@/lib/utils';

function headingText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(headingText).join('');
  return '';
}

export const markdownComponents: Components = {
  h2: ({ children, ...props }) => (
    <h2 id={slugify(headingText(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 id={slugify(headingText(children))} {...props}>
      {children}
    </h3>
  ),
  a: ({ href, children }) => {
    if (href?.startsWith('/')) {
      return <Link href={href}>{children}</Link>;
    }
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
};
