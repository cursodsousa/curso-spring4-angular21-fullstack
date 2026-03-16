export interface ValidationErrorResponse {
    timestamp: Date;
    status: number;
    error: string;
    camposInvalidos: CampoInvalido[]
}

export interface CampoInvalido {
    campo: string;
    erro: string;
}