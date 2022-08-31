import { Task } from '@dms/app/models/main/tasks/Task';
import { MainTaskType } from "@dms/app/models/main/tasks/MainTaskType";

/**
 * MainTask  interface
 *
 * @interface MainTask
 */
export interface MainTask {
  id: number;
  mainTaskTypeId: number;
  mainTaskType: MainTaskType;
  driverId: number
  driverName: string,
  driverImageUrl: string,
  noOfTasks: number,
  noOfCompletedTasks: number,
  isCompleted: boolean,
  isDelayed: boolean,
  tasks: Task[];
  image: string;
  taskStatusType?: string;
  mainTaskStatus?: any;
}
