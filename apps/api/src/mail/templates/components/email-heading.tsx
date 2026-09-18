import { Heading } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailHeadingProps {
  children: ReactNode;
}

export function EmailHeading({ children }: EmailHeadingProps) {
  return <Heading style={styles.heading}>{children}</Heading>;
}

const styles = {
  heading: {
    color: '#18181b',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '30px',
    fontWeight: '500',
    letterSpacing: '-0.7px',
    lineHeight: '36px',
    margin: '0 0 24px',
  },
};
