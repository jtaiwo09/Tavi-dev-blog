import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailLayoutProps {
  children: ReactNode;
  preview?: string;
}

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />

      {preview && <Preview>{preview}</Preview>}

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.logo}>T</Text>

            <Text style={styles.brand}>Tavi / Dev</Text>
          </Section>

          <Section>{children}</Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f7f6f2',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '48px 16px',
  },

  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '36px 40px',
    backgroundColor: '#ffffff',
    border: '1px solid #e4e4e7',
    borderRadius: '12px',
  },

  header: {
    borderBottom: '1px solid #e4e4e7',
    paddingBottom: '24px',
    marginBottom: '36px',
  },

  logo: {
    display: 'inline-block',
    width: '32px',
    height: '32px',
    backgroundColor: '#4f46e5',
    borderRadius: '999px',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    lineHeight: '32px',
    textAlign: 'center' as const,
    margin: '0 8px 0 0',
    verticalAlign: 'middle',
  },

  brand: {
    display: 'inline-block',
    color: '#52525b',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.16em',
    lineHeight: '32px',
    textTransform: 'uppercase' as const,
    margin: '0',
    verticalAlign: 'middle',
  },
};
