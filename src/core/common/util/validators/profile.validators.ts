function isValidMember(member: string) {
  return /^[A-Za-z]+$/.test(member);
}

export {
  isValidMember
};
