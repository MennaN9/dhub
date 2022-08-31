import { Admin } from "./Admin";

/**
 * AdminResult interface
 *
 * 
 * @interface Admin
 */
export class AdminResult{
    succeeded?: boolean;
    errors?: {code: string, description: string}[];
    error?: string;
    result?: Admin;
}