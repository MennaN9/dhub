import { Customer } from './../../settings/Customer';
import { TaskHistory } from './TaskHistory';

/**
 * Task  interface
 *
 *
 *
 * @interface Task
 */
export interface Task {
  id: number;
  mainTaskId?: number;
  taskTypeId: number;
  taskTypeName: string;
  taskStatusId: number;
  taskStatusName: string;
  driverId: number;
  driverName: string;
  teamName: string;
  teamId: number;
  orderId: string;
  address: string;
  latitude: string;
  longitude: string;
  description: string;
  branchId?: number;
  image: string;
  pickupDate: string;
  deliveryDate: string;
  customerId: number;
  customer: Customer;
  startDate: null;
  delayTime: null;
  taskHistories: TaskHistory[];
  totalTaskTime?: any;
  totalTime?: any;
  totalDistance?: any;
  totalWaitingTime?: any;

  totalEstimationTime?: any;
}



