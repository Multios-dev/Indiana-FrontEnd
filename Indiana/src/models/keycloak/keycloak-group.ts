import { KeyCloakMember } from "./keycloak-member";

export interface KeyCloakGroup {
    id: string;
    members: KeyCloakMember[];
    name: string;
    path: string;
}