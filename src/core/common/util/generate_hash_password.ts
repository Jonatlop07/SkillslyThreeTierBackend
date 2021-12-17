import * as bcrypt from 'bcryptjs';

export default function generateHashedPassword(password: string): string {
  const SALT_ROUNDS = 10;
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
}
