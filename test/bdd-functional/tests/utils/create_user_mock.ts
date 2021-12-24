export function createUserMock(email?: string, password?: string) {
  return {
    email: email || 'newuser_123@test.com',
    password: password || 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
    is_investor: false,
    is_requester: false
  };
}
