/**
 * Agent-Type interface
 *
 *
 * @interface AccountLogs
 */
export interface AccountLogs {
    id: number;
    record_Id: number;
    activityType: string;
    description: string;
    tableName: string;
    createdBy_Id: string;
    createdDate : Date;
}
