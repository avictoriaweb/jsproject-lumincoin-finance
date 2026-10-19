import {AuthUtils} from "../utils/auth-utils";

export type AuthKey = typeof AuthUtils.accessTokenKey | typeof AuthUtils.refreshTokenKey | typeof AuthUtils.userInfoTokenKey;

export type AuthInfo = {
    [AuthUtils.accessTokenKey]: string | null,
    [AuthUtils.refreshTokenKey]: string | null,
    [AuthUtils.userInfoTokenKey]: string | null
}