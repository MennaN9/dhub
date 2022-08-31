/*
  changeLanguageResult
*/
export class changeLanguageResult{
    succeeded?: boolean;
    errors?: {code: string, description: string}[];
    error?: string;
    result?: string;
}