export interface GetCommentsInPermanentPostOutputModel{
  comment: string;
  timestamp: string;
  email: string;
  name: string;
}

export function isGetCommentsInPermanentPostOutputModel(obj: any): obj is GetCommentsInPermanentPostOutputModel{
  return (
    obj.comment !== undefined &&
    obj.timestamp !== undefined &&
    obj.email !== undefined &&
    obj.name !== undefined
  );
}