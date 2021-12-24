function isValidServiceOfferTitle(title: string): boolean {
  return title && title.length > 0;
}

function isValidServiceOfferServiceBrief(service_brief: string): boolean {
  return service_brief && service_brief.length > 0;
}

function isValidServiceOfferContactInformation(contact_information: string): boolean {
  return contact_information && contact_information.length > 0;
}

function isValidServiceOfferCategory(category: string): boolean {
  return category && category.length > 0;
}

export {
  isValidServiceOfferTitle,
  isValidServiceOfferServiceBrief,
  isValidServiceOfferContactInformation,
  isValidServiceOfferCategory
};
