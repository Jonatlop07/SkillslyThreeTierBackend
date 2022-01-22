import { Request } from 'express';

export type HttpUserPayload = {
  id: string,
  customer_id: string,
  email: string,
  roles: Array<string>
};

export type HttpRequestWithUser = Request & { user: HttpUserPayload };

export type HttpJwtPayload = {
  id: string,
};

export type HttpLoggedInUser = {
  id: string,
  customer_id: string,
  email: string,
  access_token: string,
  roles: Array<string>
};
