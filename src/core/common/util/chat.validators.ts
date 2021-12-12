function isValidGroupConversationName(name) {
  const MAX_NAME_LENGTH = 20;
  return name !== '' && name.length <= MAX_NAME_LENGTH;
}


export {
  isValidGroupConversationName,
};
