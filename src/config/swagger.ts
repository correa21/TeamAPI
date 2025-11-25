import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Rugby Team API',
            version: '1.0.0',
            description: 'RESTful API for managing Rugby team data, including players, teams, finances, and statistics.',
            contact: {
                name: 'Rugby Team',
                url: 'https://your-team.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
            {
                url: process.env.API_URL || 'https://api.your-team.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your Supabase JWT token',
                },
            },
            schemas: {
                Team: {
                    type: 'object',
                    required: ['name', 'region'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique team identifier',
                        },
                        name: {
                            type: 'string',
                            description: 'Team name',
                            example: 'My Team',
                        },
                        region: {
                            type: 'string',
                            description: 'Team region',
                            example: 'Ciudad de México',
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Player: {
                    type: 'object',
                    required: ['team_id', 'player_name', 'date_of_birth', 'curp', 'email', 'password', 'federation_id'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique player identifier',
                        },
                        team_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Team UUID',
                        },
                        player_name: {
                            type: 'string',
                            example: 'Juan Pérez',
                        },
                        date_of_birth: {
                            type: 'string',
                            format: 'date',
                            example: '1995-05-15',
                        },
                        curp: {
                            type: 'string',
                            description: 'Mexican CURP',
                            example: 'PEXJ950515HDFRNN01',
                        },
                        short_size: {
                            type: 'string',
                            nullable: true,
                            example: 'M',
                        },
                        jersey_size: {
                            type: 'string',
                            nullable: true,
                            example: 'L',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'juan@example.com',
                        },
                        phone_number: {
                            type: 'string',
                            nullable: true,
                            example: '+525512345678',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'Hashed password',
                        },
                        federation_id: {
                            type: 'integer',
                            example: 12345,
                        },
                        eligibility: {
                            type: 'boolean',
                            default: true,
                        },
                        category: {
                            type: 'string',
                            nullable: true,
                            example: 'Senior',
                        },
                        profile_picture: {
                            type: 'string',
                            nullable: true,
                            description: 'URL to profile picture',
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                PlayerNumber: {
                    type: 'object',
                    required: ['player_id', 'team_id', 'player_number'],
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        player_id: {
                            type: 'integer',
                        },
                        team_id: {
                            type: 'string',
                            format: 'uuid',
                        },
                        player_number: {
                            type: 'integer',
                            example: 10,
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Affiliations: {
                    type: 'object',
                    required: ['player_id'],
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        player_id: {
                            type: 'integer',
                        },
                        federation: {
                            type: 'boolean',
                            default: false,
                        },
                        association: {
                            type: 'boolean',
                            default: false,
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Payments: {
                    type: 'object',
                    required: ['player_id'],
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        player_id: {
                            type: 'integer',
                        },
                        total_payed: {
                            type: 'integer',
                            description: 'Total amount paid in cents or smallest currency unit',
                            default: 0,
                        },
                        total_debt: {
                            type: 'integer',
                            description: 'Total debt in cents or smallest currency unit',
                            default: 0,
                        },
                        debt: {
                            type: 'boolean',
                            description: 'Whether player has outstanding debt',
                            default: false,
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Admin: {
                    type: 'object',
                    required: ['player_id', 'role'],
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        player_id: {
                            type: 'integer',
                        },
                        role: {
                            type: 'string',
                            example: 'super_admin',
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Season: {
                    type: 'object',
                    required: ['modality', 'name'],
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        modality: {
                            type: 'string',
                            example: '15s',
                        },
                        name: {
                            type: 'string',
                            example: 'Temporada 2024',
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Stats: {
                    type: 'object',
                    required: ['player_id', 'season_id'],
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        player_id: {
                            type: 'integer',
                        },
                        season_id: {
                            type: 'integer',
                        },
                        yellow_card: {
                            type: 'integer',
                            default: 0,
                        },
                        red_card: {
                            type: 'integer',
                            default: 0,
                        },
                        try: {
                            type: 'integer',
                            default: 0,
                        },
                        drop: {
                            type: 'integer',
                            default: 0,
                        },
                        conversion: {
                            type: 'integer',
                            default: 0,
                        },
                        penalty_scored: {
                            type: 'integer',
                            default: 0,
                        },
                        points: {
                            type: 'integer',
                            default: 0,
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        error: {
                            type: 'string',
                            example: 'Error message',
                        },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        data: {
                            type: 'object',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and registration endpoints',
            },
            {
                name: 'Teams',
                description: 'Team management endpoints',
            },
            {
                name: 'Players',
                description: 'Player management endpoints',
            },
            {
                name: 'Player Numbers',
                description: 'Jersey number assignment endpoints',
            },
            {
                name: 'Affiliations',
                description: 'Player affiliation management',
            },
            {
                name: 'Payments',
                description: 'Financial tracking endpoints',
            },
            {
                name: 'Admins',
                description: 'Admin role management',
            },
            {
                name: 'Seasons',
                description: 'Season management endpoints',
            },
            {
                name: 'Stats',
                description: 'Player statistics endpoints',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to route files
};

export const swaggerSpec = swaggerJsdoc(options);
