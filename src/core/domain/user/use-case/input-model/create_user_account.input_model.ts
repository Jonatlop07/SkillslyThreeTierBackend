export default interface CreateUserAccountInputModel {
  email: string;
  password: string;
  name: string;
  date_of_birth: string;
  is_investor: boolean;
  is_requester: boolean;
}
