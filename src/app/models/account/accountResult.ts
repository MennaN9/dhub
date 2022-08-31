import { UserInfo } from "./userInfo";

export class UserManagerResult{
    succeeded?: boolean;
    errors?: {code: string, description: string}[];
    error?: string;
    user?: UserInfo;
}

export class LoginResult extends UserManagerResult{
    tokenResponse?: TokenResponse;
}

export class TokenResponse{
    accessToken?: string;
    identityToken?: string;
    tokenType?: string;
    refreshToken?: string;
    errorDescription?: string;
    expiresIn?: number;
}