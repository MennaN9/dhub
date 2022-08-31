/**
 * Dispatching Managers interface
 *
 *
 * @interface DispatchingManagers
 */
export interface DispatchingManagers {
  id: number;
  designationName: string;
  zones: string;
  lkpZones: LkpViewModel[];
  restaurants: string;
  lkpRestaurants: LkpViewModel[];
  branches: string;
  lkpBranches: LkpViewModel[];
  managerId: number;
  managerName: string;
}

export interface LkpViewModel {
  id: number;
  name: string;
}



