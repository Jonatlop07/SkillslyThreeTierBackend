function isValidServiceRequestTitle(title: string): boolean {
  return title && title.length > 0;
}

function isValidServiceRequestServiceBrief(service_brief: string): boolean {
  return service_brief && service_brief.length > 0;
}

function isValidServiceRequestContactInformation(contact_information: string): boolean {
  return contact_information && contact_information.length > 0;
}

function isValidServiceRequestCategory(category: string): boolean {
  return category && category.length > 0;
}

export {
  isValidServiceRequestTitle,
  isValidServiceRequestServiceBrief,
  isValidServiceRequestContactInformation,
  isValidServiceRequestCategory
};
