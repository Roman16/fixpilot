export interface ILoginInput {
    email: string;
    password: string;
  }
  
  export interface IRegisterInput extends ILoginInput {
    companyName: string;
    confirmPassword: string;
  }
  
  export interface IAuthResponse {
    token: string;
    user: {
      _id: string;
      email: string;
      companyName: string;
    };
  }
  
  export interface TokenPayload {
    id: string;
    email?: string;
  }