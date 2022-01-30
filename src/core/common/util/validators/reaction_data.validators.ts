const valid_types = ['like', 'interested', 'fun'];

function isValidType(member: string) {
  return valid_types.includes(member);
}

export {
  isValidType
};
