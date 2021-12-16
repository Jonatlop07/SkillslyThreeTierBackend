function isValidGroupConversationName(name) {
  const MAX_NAME_LENGTH = 40;
  return name !== '' && name.length <= MAX_NAME_LENGTH;
}

export {
  isValidGroupConversationName,
};
