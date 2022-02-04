export default interface ValidateCredentialsOutputModel {
  id: string;
  customer_id: string;
  email: string;
  roles: Array<string>;
  is_two_factor_auth_enabled: boolean;
}
