import { Request } from 'express';

export type HttpUserPayload = {
  id: string,
  email: string
};

export type HttpRequestWithUser = Request & { user: HttpUserPayload };

export type HttpJwtPayload = {
  id: string
};

export type HttpLoggedInUser = {
  id: string,
  email: string,
  access_token: string,
};
