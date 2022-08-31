/**
 * Team interface
 *
 * 
 * @interface Team
 */
export interface Team {
    id: number;
    name: string;
    tags: string | any;
    address: string;
    locationAccuracyId: number;
}