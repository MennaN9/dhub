import { Driver } from "../../settings/Driver";
import { Task } from "./Task";

export interface MapMarker {
    index?: number;
    lat: number;
    lng: number;
    type: string;
    windowTitle?: string;
    isDriver?: boolean;
    driver?: Driver;
    task?: Task;
}

