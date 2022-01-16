export interface ServiceOfferBelongsToUser {
  belongsServiceOfferToUser(service_offer_id: string, user_id: string): Promise<boolean>;
}
