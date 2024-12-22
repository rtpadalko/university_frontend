export type T_Specialization = {
    id: string
    name: string
    description: string
    budget_place: number
    budget_passing_score: number
    paid_place: number
    price: number
    image: string
    status: number
    priority?: number
}

export type T_Applicant = {
    id: string | null
    status: E_ApplicantStatus
    date_complete: string
    date_created: string
    date_formation: string
    owner: string
    moderator: string
    specializations: T_Specialization[]
    name: string
    birthday_date: string
    rating: string
}

export enum E_ApplicantStatus {
    Draft=1,
    InWork,
    Completed,
    Rejected,
    Deleted
}

export type T_User = {
    id: number
    username: string
    is_authenticated: boolean
    is_superuser: boolean
}

export type T_ApplicantsFilters = {
    date_formation_start: string
    date_formation_end: string
    status: number
    owner: string
}

export type T_SpecializationsListResponse = {
    specializations: T_Specialization[],
    draft_applicant_id?: number,
    specializations_count?: number
}

export type T_LoginCredentials = {
    username: string
    password: string
}

export type T_RegisterCredentials = {
    name: string
    email: string
    password: string
}

export type T_SpecializationAddData = {
    name: string;
    description: string;
    price: number;
    image?: File | null;
}

export type T_Faculty = {
    id: string
    name: string
    description: string
    image: string
    status: number
}