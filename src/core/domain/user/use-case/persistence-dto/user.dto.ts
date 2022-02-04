export interface UserDTO {
  user_id?: string,
  customer_id?: string;
  email: string;
  password: string;
  name: string;
  date_of_birth: string;
  roles?: Array<string>;
  created_at?: string;
  updated_at?: string;
  is_two_factor_auth_enabled?: boolean;
  two_factor_auth_secret?: string;
}
