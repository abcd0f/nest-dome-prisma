export function getCorsOption() {
  return {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Authorization', 'content-type'],
    exposedHeaders: 'Custom-Header',
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 200,
  };
}
