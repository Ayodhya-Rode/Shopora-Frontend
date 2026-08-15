export interface UserLoginFormData {
  email: string;
  password: string;
}

export interface UserRegisterFormData {
  userName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}