export interface GetCommentsInPermanentPostOutputModel {
  id: string;
  comment: string;
  timestamp: string;
  email: string;
  name: string;
}

export function isGetCommentsInPermanentPostOutputModel(obj: any): obj is GetCommentsInPermanentPostOutputModel {
  return (
    obj.id !== undefined &&
    obj.comment !== undefined &&
    obj.timestamp !== undefined &&
    obj.email !== undefined &&
    obj.name !== undefined
  );
}