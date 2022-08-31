/*
   DeativationResult 
*/
export class DeativationResult{
    succeeded?: boolean;
    errors?: {code: string, description: string}[];
    error?: string;
    result?: string;
}