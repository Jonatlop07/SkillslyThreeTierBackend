export default interface CreateProfileInputModel {
  resume: string,
  knowledge: Array<string>,
  talents: Array<string>,
  activities: Array<string>,
  interests: Array<string>,
  userEmail: string;
}
