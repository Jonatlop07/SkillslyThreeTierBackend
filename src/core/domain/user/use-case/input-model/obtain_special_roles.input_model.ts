export default interface ObtainSpecialRolesInputModel {
  user_id: string;
  customer_id: string;
  current_roles: Array<string>;
  obtain_investor_role: boolean;
  obtain_requester_role: boolean;
  payment_method_id: string;
}
