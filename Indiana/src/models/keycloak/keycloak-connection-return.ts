export interface KeycloakConnectionReturn {
    exists: boolean;
    valid_password: boolean;
}

export interface KeycloakConnectionReturnOtp {
    access_token: string;
}