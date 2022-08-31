export interface DriverLoginRequest {
  id: number;
  status: number;
  token: string;
  driverId: number;
  driverName: string;

  approvedOrRejectBy: string;

  teamId: number;
  teamName: string;
  agentTypeId: number;
  agentTypeName: string;
  createdBy_Id?: number;
  updatedBy_Id?: number;
  deletedBy_Id?: number;
  isDeleted: boolean;
  createdDate: Date;
  updatedDate: Date;
  deletedDate: Date;
  rejectReason: string;
}
