import { Heading } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailHeadingProps {
  children: ReactNode;
}

export function EmailHeading({ children }: EmailHeadingProps) {
  return (
    <>
      <style>{`
        @media only screen and (max-width: 600px) {
          .email-heading {
            font-size: 22px !important;
            line-height: 28px !important;
            margin-bottom: 16px !important;
            letter-spacing: -0.4px !important;
          }
        }
      `}</style>

      <Heading style={styles.heading} className="email-heading">
        {children}
      </Heading>
    </>
  );
}

const styles = {
  heading: {
    color: '#18181b',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '28px', // Scaled slightly down from 30px for standard desktops
    fontWeight: '500',
    letterSpacing: '-0.7px',
    lineHeight: '34px',
    margin: '0 0 20px',
  },
};
