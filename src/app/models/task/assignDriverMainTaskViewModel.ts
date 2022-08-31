export class AssignmentConfigurationViewModel {
    settings?: TaskSettingsViewModel | undefined;

    constructor(data?: AssignmentConfigurationViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export class AssignDriverMainTaskViewModel {
    mainTask?: MainTaskViewModel | undefined;
    driverIds?: number[] | undefined;

    constructor(data?: AssignDriverMainTaskViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export class MainTaskViewModel {
    id?: number;
    mainTaskTypeId?: number;
    mainTaskTypeName?: string | undefined;
    isCompleted?: boolean | undefined;
    isDelayed?: boolean | undefined;
    assignmentType?: number;
    tasks?: TasksViewModel[] | undefined;
    settings?: TaskSettingsViewModel | undefined;

    constructor(data?: MainTaskViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export class TasksBaseInfoViewModel {
    id?: number;
    taskStatusId?: number | undefined;
    taskStatusName?: string | undefined;
    image?: string | undefined;
    formImage?: File | undefined;
    orderId?: string | undefined;
    address?: string | undefined;
    latitude?: number;
    longitude?: number;
    customerId?: number;
    startDate?: Date | undefined;
    delayTime?: number | undefined;
    taskHistories?: TaskHistoryViewModel[] | undefined;

    constructor(data?: TasksBaseInfoViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export class TasksViewModel extends TasksBaseInfoViewModel {
    mainTaskId?: number;
    taskTypeId?: number;
    taskTypeName?: string | undefined;
    driverId?: number | undefined;
    driverName?: string | undefined;
    description?: string | undefined;
    pickupDate?: any | undefined;
    deliveryDate?: any | undefined;
    customer?: CustomerViewModel | undefined;
    branchId?: number;
    customerId?: number;
    location?: object;
    shippmentType?: string;

    constructor(data?: TasksViewModel) {
        super(data);
    }
}

export class CustomerViewModel {
    id?: number;
    name?: string | undefined;
    email?: string | undefined;
    cid?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    latitude?: string | undefined;
    longitude?: string | undefined;
    tags?: string | undefined;
    countryId?: number;
    country?: CountryViewModel | undefined;
    location?: object | undefined;

    constructor(data?: CustomerViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export class CountryViewModel {
    id?: number;
    name?: string | undefined;
    code?: string | undefined;
    flag?: string | undefined;
    flagUrl?: string | undefined;
    topLevel?: string | undefined;

    constructor(data?: CountryViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export class TaskHistoryViewModel {
    id?: number;
    taskId?: number;
    mainTaskId?: number;
    fromStatusId?: number | undefined;
    toStatusId?: number | undefined;
    description?: string | undefined;
    reason?: string | undefined;

    constructor(data?: TaskHistoryViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export class TaskBasicSettingsViewModel {
    driverIds?: number[] | undefined;
    teamIds?: number[] | undefined;
    tags?: string[] | undefined;

    constructor(data?: TaskBasicSettingsViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}

export class TaskSettingsViewModel extends TaskBasicSettingsViewModel {
    auto?: boolean;
    driversCount?: number;
    restrictGeofences?: boolean;

    constructor(data?: TaskSettingsViewModel) {
        super(data);
    }
}
