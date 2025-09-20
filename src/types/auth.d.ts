export interface ILoginInput {
    email: string;
    password: string;
  }
  
  export interface IRegisterInput extends ILoginInput {
    company: string;
    confirmPassword: string;
  }
  
  export interface IAuthResponse {
    token: string;
    user: {
      _id: string;
      email: string;
      company: string;
    };
  }
  
  export interface TokenPayload {
    id: string;
    email?: string;
  }