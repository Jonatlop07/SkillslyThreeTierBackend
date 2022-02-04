export function setEnvironment() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return ['local.app.env'];
    case 'test':
      return ['test.app.env', 'local.app.env'];
    case 'production':
      return ['prod.app.env'];
    default:
      return 'local.app.env';
  }
}
