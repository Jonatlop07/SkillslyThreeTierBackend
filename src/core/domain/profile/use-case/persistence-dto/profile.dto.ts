export interface ProfileDTO {
  resume: string;
  knowledge: Array<string>;
  talents: Array<string>;
  activities: Array<string>;
  interests: Array<string>;
  user_id?: string;
  profile_id?: string;
}
