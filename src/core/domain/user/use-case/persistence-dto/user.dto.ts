export interface UserDTO {
  user_id?: string,
  email: string;
  password: string;
  name: string;
  date_of_birth: string;
  roles?: Array<string>;
  created_at?: string;
  updated_at?: string;
}
