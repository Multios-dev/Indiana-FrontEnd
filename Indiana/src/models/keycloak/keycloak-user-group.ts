import { KeyCloakGroup } from "./keycloak-group";
import { KeyCloakSubGroup } from "./keycloak-subgroup";

export interface KeyCloakUserGroup {
    group: KeyCloakGroup;
    subgroups: KeyCloakSubGroup[];
}

