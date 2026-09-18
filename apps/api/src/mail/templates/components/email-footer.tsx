import { Section, Text } from '@react-email/components';

export function EmailFooter() {
  return (
    <Section>
      <Text style={styles.brand}>Tavi / Dev</Text>

      <Text style={styles.footer}>© {new Date().getFullYear()} Tavi Dev</Text>
    </Section>
  );
}

const styles = {
  brand: {
    color: '#111113',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    lineHeight: '18px',
    textAlign: 'center' as const,
    margin: '0 0 4px',
  },

  footer: {
    color: '#8b8b94',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '11px',
    lineHeight: '18px',
    textAlign: 'center' as const,
    margin: '0',
  },
};
