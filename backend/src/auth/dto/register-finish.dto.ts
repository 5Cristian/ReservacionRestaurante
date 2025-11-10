export class RegisterFinishDto {
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
  verificationCode: string;
  password: string;
}
