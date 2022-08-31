/**
 * TaskHistory  interface
 *
 * @interface TaskHistory
 */
export interface TaskHistory {
  id: number;
  taskId: number;
  mainTaskId: number;
  fromStatusId?: number;
  fromStatusName: string;
  toStatusId?: number;
  toStatusName: string;
  reason?: any;
  actionName: string;
  latitude?: any;
  longitude?: any;
  createdDate: Date;
  createdBy: string;
}
