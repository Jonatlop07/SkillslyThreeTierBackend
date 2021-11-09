export type CreateProfileEntityPayload = {
  resume: string,
  knowledge: Array<string>,
  talents: Array<string>,
  activities: Array<string>,
  interests: Array<string>,
  userID: number;
  id?: number,
};
