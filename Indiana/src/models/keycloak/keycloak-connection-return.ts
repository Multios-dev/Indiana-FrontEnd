export interface KeycloakConnectionReturn {
  access_token?: string;   // présent si l'utilisateur n'a pas l'OTP
  exists?: boolean;        // présent si l'utilisateur a l'OTP
  valid_password?: boolean;
}

export interface KeycloakConnectionReturnOtp {
    access_token: string;
}