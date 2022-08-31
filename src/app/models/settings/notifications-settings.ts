
export interface NotificationSettingLookup {
    events: Event[];
    id: number;
    name: string;
}

export interface NotificationSetting {
    group: string;
    event: string;
    users?: any;
    notifyBylist?: any;
}

interface User {
    id: number;
    name: string;
}

interface NotifyByList {
    id: number;
    name: string;
}

export interface Event {
    users: User[] | number[];
    notifyByList: NotifyByList[] | number[];
    id: number;
    name: string;
    selectedUsers?: number[],
    selectedNotifyList?: number[],
}