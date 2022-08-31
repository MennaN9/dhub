export interface TanentConfig {
  tenantId: string,
  isSupportingAPIIntegration: true,
  apiIntegrationURL: string,
  deliveryDetails: [
    {
      fromGeofences: number[],
      toGeofences: number[],
      feesCalculationType: number,
      fixedFees: number,
      externalFees: number,
      distanceFees: [
        {
          fromDistance: number,
          toDistance: number,
          fees: number
        }
      ]
    }
  ]
}
