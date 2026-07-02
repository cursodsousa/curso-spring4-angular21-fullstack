export class LoginForm {
    login!: string;
    senha!: string;
}

export class CadastroUsuarioForm {
    nome!: string;
    login!: string;
    senha!: string;
}

export class AuthResponse {
    token!: string;
    tipo!: string;
    expiraEm!: number;
    nome!: string;
}