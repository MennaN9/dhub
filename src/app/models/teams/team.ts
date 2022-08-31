export interface Team {
    id: number;
    name: string;
    tags: string | any;
    address: string;
    locationAccuracyId: number;
  }
  
  export interface Location {
    id: number;
    name: string;
  }