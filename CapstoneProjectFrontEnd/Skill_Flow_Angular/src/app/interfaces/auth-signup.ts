export interface AuthSignup {
    username: string;
    name: string;
    surname: string;
    dateOfBirth: string;
    email: string;
    password: string;
    pictureProfile : string | null
    interests:string[];
}
