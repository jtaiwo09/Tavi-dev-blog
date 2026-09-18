export function sanitizeUser(user: {
  password?: string | null;
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  const { password, ...safe } = user;

  return safe;
}
