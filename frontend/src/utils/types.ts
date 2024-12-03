export type T_Specialization = {
    id: string
    name: string
    description: string
    price: number
    image: string
    status: number
    priority: string
}

export type T_Applicant =  {
    id: number,
    name: string,
    description: string,
    price: number,
    image: string,
    status: number,
    budget_place: number,
    budget_passing_score: number,
    paid_place: number,
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
    email: string
    is_authenticated: boolean
    validation_error: boolean
    validation_success: boolean
    checked: boolean
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

export type T_SpecializationsListResponse = {
    specializations: T_Specialization[],
    draft_applicant_id: number,
    specializations_count: number
}

export type T_Faculty = {
    id: string
    name: string
    description: string
    image: string
    status: number
}