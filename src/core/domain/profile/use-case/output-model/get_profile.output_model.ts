export default interface GetProfileOutputModel {
  resume: string,
  knowledge: Array<string>,
  talents: Array<string>,
  activities: Array<string>,
  interests: Array<string>,
  profileID?: string
}
