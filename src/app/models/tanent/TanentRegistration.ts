export interface TanentRegistration {
    registrationBusinessType:number,
    name: string;
    email: string;
    //phoneNumber: string;
    businessType: number;
    countryId: number,
    otherBusinessType: string;
    businessCID: string;
    latitude: number;
    longitude: number;
    paci: string;
  businessAddress: {
       paciNumber: string;
        governorate: string;
        area: string;
        block: string;
        street: string;
        building: string;
        floor: string;
        flat: string;
    }
    socialMediaAccounts: string[];
    ownerName: string;
    ownerCID: string;
    ownerPhoneNumber: string;
    isSameBusinessAddress: boolean;
  ownerAddress: {
        paciNumber: string;
        governorate: string;
        area: string;
        block: string;
        street: string;
        building: string;
        floor: string;
        flat: string;
    }
  //   ownerPACI: string;
  //   governorate: string;
  //   ownerAreaId: string;
  //   ownerAreaName: string;
  //   ownerBlock: string;
  //   ownerStreet: string;
  //   ownerBuilding: string;
  //   ownerFloor: string;
  // ownerApartment: string;

  hasOwnDrivers: boolean;
  numberOfDrivers: number;
  //  hasMultiBranches: boolean;
  //  branchCount: number;
    isDeliverToAllZones: boolean;
    servingRadiusInKM: number;
  numberOfOrdersByDriverPerOrder: number;
  contractRange:number
}
