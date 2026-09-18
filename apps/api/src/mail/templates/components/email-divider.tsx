import { Hr } from '@react-email/components';

export function EmailDivider() {
  return <Hr style={styles.divider} />;
}

const styles = {
  divider: {
    borderColor: '#e4e4e7',
    margin: '32px 0',
  },
};
