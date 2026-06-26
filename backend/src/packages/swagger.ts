export const packageResponseOpenApiSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Deep Tissue Massage' },
    description: {
      type: 'string',
      example: 'A focused massage session for muscle tension and recovery.'
    },
    priceCents: { type: 'integer', example: 7500 },
    durationMinutes: { type: 'integer', example: 60 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: [
    'id',
    'name',
    'description',
    'priceCents',
    'durationMinutes',
    'createdAt',
    'updatedAt'
  ]
};

export const packageListResponseOpenApiSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: packageResponseOpenApiSchema
    }
  },
  required: ['items']
};

export const createPackageOpenApiSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'Deep Tissue Massage' },
    description: {
      type: 'string',
      example: 'A focused massage session for muscle tension and recovery.'
    },
    priceCents: { type: 'integer', minimum: 0, example: 7500 },
    durationMinutes: { type: 'integer', minimum: 1, maximum: 1440, example: 60 }
  },
  required: ['name', 'description', 'priceCents', 'durationMinutes']
};
