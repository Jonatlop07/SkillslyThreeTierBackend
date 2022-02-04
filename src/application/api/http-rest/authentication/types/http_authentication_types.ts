import { Request } from 'express';

export type HttpUserPayload = {
  id: string,
  customer_id: string,
  email: string,
  roles: Array<string>,
  is_two_factor_auth_enabled?: boolean
};

export type HttpRequestWithUser = Request & { user: HttpUserPayload };

export type HttpJwtPayload = {
  id: string,
  is_two_factor_authenticated?: boolean
};

export type HttpLoggedInUser = {
  id?: string,
  customer_id?: string,
  email?: string,
  access_token: string,
  roles?: Array<string>
};
