import { Button, Section } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailButtonProps {
  href: string;
  children: ReactNode;
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <>
      <style>{`
        @media only screen and (max-width: 600px) {
          .email-button {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            text-align: center !important;
            padding: 10px 12px !important;
            font-size: 13px !important;
          }
        }
      `}</style>

      <Section style={styles.section}>
        <Button href={href} style={styles.button} className="email-button">
          {children}
        </Button>
      </Section>
    </>
  );
}

const styles = {
  section: {
    marginBottom: '20px',
  },

  button: {
    backgroundColor: '#4f46e5',
    borderRadius: '6px',
    color: '#ffffff',
    display: 'inline-block',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    textDecoration: 'none',
    padding: '10px 18px', // Moderate desktop padding
    textAlign: 'center' as const,
  },
};
