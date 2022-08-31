
export interface Dashboard {
    pageNumber?: number;
    pageSize?: number;
    searchBy?: string;
    id?: number;
    totalNumbers?: number;
    userID?: string;
    timeZone?: string;
    startDate?: Date;
    endDate?: Date;
    fromDate?: Date;
    toDate?: Date;
    taskTypeIds?: any[];
    driversIds?: any[];
    tenantIds?: any[];
}


export interface TotalRequests {
    pendingBusinessRequests: number;
    pendingDriverRequests: number;
    pendingDriverLoginRequests: number;
}

export interface TotalOrders {
    unassignedOrders: number;
    assignedOrders: number;
    completedOrders: number;
}

export interface AccountOrders {
    result: Order[];
    totalCount: number;
}

export interface Result {
    totalRequests: TotalRequests;
    totalOrders: TotalOrders;
    accountOrders: AccountOrders;
}

export interface Order {
    tenantId: string;
    companyName: string;
    id: number;
    orderId: string;
    driverId: number;
    driverName: string;
    taskTypeId: number;
    taskTypeName: string;
    taskStatusId: number;
    taskStatusName: string;
    orderDate: Date;
}