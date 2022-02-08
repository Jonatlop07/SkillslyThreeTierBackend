export interface PartialUserUpdateDTO {
  email?: string;
  password?: string;
  name?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
  is_two_factor_auth_enabled?: boolean;
  two_factor_auth_secret?: string;
  reset_password_token?: string;
}
