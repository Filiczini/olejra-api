module.exports = {
  createTask: {
    body: {
      type: 'object',
      required: ['title'],
      additionalProperties: false,
      properties: {
        title: { type: 'string', minLength: 1, maxLength: 200 },
        description: { type: 'string', maxLength: 2000 },
      },
    },
  },

  advanceTask: {
    body: {
      type: 'object',
      required: ['taskId', 'from', 'to'],
      additionalProperties: false,
      properties: {
        taskId: { type: 'string', minLength: 10 },
        from: { type: 'string' },
        to: { type: 'string' },
      },
    },
  },
};
