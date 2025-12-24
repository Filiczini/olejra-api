module.exports = {
  login: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      additionalProperties: false,
      properties: {
        email: { type: 'string', minLength: 3 },
        password: { type: 'string', minLength: 1 },
      },
    },
  },
};
