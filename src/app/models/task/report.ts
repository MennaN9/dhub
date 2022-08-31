/**
 *
 * @class TaskReport param
 */

export class TaskReportParam {
  constructor(
    public StatusIds: number[],
    public TaskTypeIds: number[],
    public DriversIds: number[],
    public ZonesIds: number[],
    public RestaurantIds: number[],
    public BranchIds: number[],
    public OrderId: string,
    public cid: string,
    public customerName: string,
    public barcode: string,
    public FromDate: any,
    public ToDate: any,
    public Address: string,

    public pageNumber: number,
    public pageSize: number,
    public searchBy: string,
    public id: number,
    public totalNumbers: number,
    public isOrderProgress: boolean,
  ) { }
}


/**
 *
 * @class Driver Working Hours Report param
 */

export class DriverReportParam {
  constructor(
    public driverIds: number[],
    public startDate: any,
    public endDate: any,
    public pageNumber: number,
    public pageSize: number,
    public searchBy: string,
    public id: number,
    public totalNumbers: number,
    public timeZone?: string,
  ) { }
}
