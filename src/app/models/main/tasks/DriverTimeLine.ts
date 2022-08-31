

/**
 * DriverTimeLine  interface
 *
 * @interface DriverTimeLine
 */
export interface DriverTimeLine {
  id: number;
  taskId: number;
  mainTaskId:number;
  fromStatusId:number;
  fromStatusName:string;
  toStatusId:number;
  toStatusName:string;
  actionName:string;
  reason:string;
  latitude: string;
  longitude: string;
  createdDate:string;
}
