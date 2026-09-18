import { Button } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailButtonProps {
  href: string;
  children: ReactNode;
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button href={href} style={styles.button}>
      {children}
    </Button>
  );
}

const styles = {
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: '8px',
    color: '#ffffff',
    display: 'inline-block',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    textDecoration: 'none',
    padding: '12px 16px',
  },
};
