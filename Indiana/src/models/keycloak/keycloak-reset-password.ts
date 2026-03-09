export interface KeyCloakResetPassword {
    user_id: string;
    old_password: string;
    new_password: string;
    confirm_password: string;
}