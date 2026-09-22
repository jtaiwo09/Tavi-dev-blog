import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { ReactNode } from 'react';

interface EmailLayoutProps {
  children: ReactNode;
  preview?: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_WEB_URL || 'https://tavi-blog.vercel.app';

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style>{`
          @media only screen and (max-width: 600px) {
            .email-body {
              padding: 16px 8px !important;
            }
            .email-container {
              padding: 24px 20px !important;
              border-radius: 8px !important;
            }
            .email-header {
              margin-bottom: 24px !important;
              padding-bottom: 16px !important;
            }
          }
        `}</style>
      </Head>

      {preview && <Preview>{preview}</Preview>}

      <Body style={styles.body} className="email-body">
        <Container style={styles.container} className="email-container">
          <Section style={styles.header} className="email-header">
            <Img
              src={`${BASE_URL}/brand.png`}
              alt="Tavi / Dev logo"
              width="32"
              height="32"
              style={styles.logoImage}
            />

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
    padding: '32px 12px', // Reduced default outer padding
  },

  container: {
    maxWidth: '600px',
    width: '100%',
    margin: '0 auto',
    padding: '28px 24px', // Moderate default inner padding
    backgroundColor: '#ffffff',
    border: '1px solid #e4e4e7',
    borderRadius: '12px',
  },

  header: {
    borderBottom: '1px solid #e4e4e7',
    paddingBottom: '20px',
    marginBottom: '28px',
  },

  logoImage: {
    display: 'inline-block',
    width: '32px',
    height: '32px',
    borderRadius: '999px',
    marginRight: '12px',
    verticalAlign: 'middle',
    objectFit: 'cover' as const,
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
