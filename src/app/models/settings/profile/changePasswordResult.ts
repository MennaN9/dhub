import { changePassword } from "./changePassword";
/*
changePasswordResult
*/
export class changePasswordResult{
    succeeded?: boolean;
    errors?: {code: string, description: string}[];
    error?: string;
    result?: string;
}