export default interface UpdateUserAccountInputModel {
  id: string;
  email: string;
  password: string;
  name: string;
  date_of_birth: string;
  is_two_factor_auth_enabled: boolean;
}
