import { KeyCloakMemberAttribute } from "./keycloak-member-attribute";
import { KeyCloakRole } from "./keycloak-role";

export interface KeyCloakMember {
    attributes?: KeyCloakMemberAttribute;
    createdTimestamp: string;
    email: string;
    emailVerified: boolean;
    enabled: boolean;
    firstName: string;
    id: string;
    lastName: string;
    roles: KeyCloakRole[];
    username: string;
}