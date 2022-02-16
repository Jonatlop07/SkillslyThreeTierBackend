import { Id } from '@core/common/type/common_types';

export default interface CreateServiceOfferInputModel {
  owner_id: Id;
  title: string;
  service_brief: string;
  contact_information: string;
  category: string;
}
