import { Text } from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailTextProps {
  children: ReactNode;
  muted?: boolean;
}

export function EmailText({ children, muted = false }: EmailTextProps) {
  return (
    <Text
      style={{
        ...styles.text,
        ...(muted ? styles.muted : {}),
      }}
    >
      {children}
    </Text>
  );
}

const styles = {
  text: {
    color: '#3f3f46',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 16px',
  },

  muted: {
    color: '#71717a',
    fontSize: '13px',
    lineHeight: '21px',
  },
};
