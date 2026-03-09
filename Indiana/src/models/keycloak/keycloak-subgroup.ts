import { KeyCloakMember } from "./keycloak-member";

export interface KeyCloakSubGroup {
    id: string;
    members: KeyCloakMember[];
    name: string;
    path: string;
}