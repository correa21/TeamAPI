export interface Team {
    id: string;
    name: string;
    region: string;
    created_at: string;
    updated_at: string;
}

export interface Player {
    id: number;
    team_id: string;
    player_name: string;
    date_of_birth: string;
    curp: string;
    rfc?: string;
    short_size: string | null;
    jersey_size: string | null;
    email: string;
    phone_number: string | null;
    password: string;
    federation_id: number;
    eligibility: boolean;
    category: string | null;
    profile_picture: string | null;
    created_at: string;
    updated_at: string;
}

export interface PlayerNumber {
    id: number;
    player_id: number;
    team_id: string;
    player_number: number;
    created_at: string;
    updated_at: string;
}

export interface Affiliations {
    id: number;
    player_id: number;
    federation: boolean;
    association: boolean;
    created_at: string;
    updated_at: string;
}

export interface Payments {
    id: number;
    player_id: number;
    total_payed: number;
    total_debt: number;
    debt: boolean;
    created_at: string;
    updated_at: string;
}

export interface Admin {
    id: number;
    player_id: number;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface Season {
    id: number;
    modality: string;
    name: string;
    is_current: boolean;
    created_at: string;
    updated_at: string;
}

export interface Stats {
    id: number;
    player_id: number;
    season_id: number;
    yellow_card: number;
    red_card: number;
    try: number;
    drop: number;
    conversion: number;
    penalty_scored: number;
    points: number;
    created_at: string;
    updated_at: string;
}

// DTOs for creation (omitting auto-generated fields)
export interface CreateTeamDTO {
    name: string;
    region: string;
}

export interface CreatePlayerDTO {
    team_id: string;
    player_name: string;
    date_of_birth: string;
    curp: string;
    rfc?: string;
    short_size?: string;
    jersey_size?: string;
    email: string;
    phone_number?: string;
    password: string;
    federation_id: number;
    eligibility?: boolean;
    category?: string;
    profile_picture?: string;
}

export interface CreatePlayerNumberDTO {
    player_id: number;
    team_id: string;
    player_number: number;
}

export interface CreateAffiliationsDTO {
    player_id: number;
    federation?: boolean;
    association?: boolean;
}

export interface CreatePaymentsDTO {
    player_id: number;
    total_payed?: number;
    total_debt?: number;
    debt?: boolean;
}

export interface CreateAdminDTO {
    player_id: number;
    role: string;
}

export interface CreateSeasonDTO {
    modality: string;
    name: string;
    is_current?: boolean;
}

export interface CreateStatsDTO {
    player_id: number;
    season_id: number;
    yellow_card?: number;
    red_card?: number;
    try?: number;
    drop?: number;
    conversion?: number;
    penalty_scored?: number;
    points?: number;
}

// Update DTOs (all fields optional)
export type UpdateTeamDTO = Partial<CreateTeamDTO>;
export type UpdatePlayerDTO = Partial<CreatePlayerDTO>;
export type UpdatePlayerNumberDTO = Partial<CreatePlayerNumberDTO>;
export type UpdateAffiliationsDTO = Partial<CreateAffiliationsDTO>;
export type UpdatePaymentsDTO = Partial<CreatePaymentsDTO>;
export type UpdateAdminDTO = Partial<CreateAdminDTO>;
export type UpdateSeasonDTO = Partial<CreateSeasonDTO>;
export type UpdateStatsDTO = Partial<CreateStatsDTO>;
