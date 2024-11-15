interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export interface RegisterResponseData {
  user: User;
}
