export type FclMode = 'FCL'
export type FclStatus = 'ACTIVE' | 'DRAFT' | 'INACTIVE'
export type FclCostType = 'confirmed' | 'conditional'
export type FclChargeGroup =
  | 'CUSTOMS CLEARANCE'
  | 'PICK-UP CHARGES'
  | 'PORT CHARGES'
  | 'ORIGIN CHARGES'
  | 'DESTINATION CHARGES'

export type FclApplyScope =
  | 'GLOBAL'
  | 'COUNTRY'
  | 'CITY'
  | 'PORT'
  | 'TERMINAL'
  | 'WAREHOUSE'
  | 'ROUTE'

export type FclChargeUnit =
  | 'per Container'
  | 'per Truck'
  | 'per Bill'
  | 'As actual'

export type FclContainerType = '20GP' | '40GP' | '40HC' | '45HC' | 'All'

export interface FclServiceCharge {
  id: string
  serviceType: string
  chargeGroup: FclChargeGroup | string
  chargeName: string
  chargeCode?: string
  unit: FclChargeUnit | string
  costType: FclCostType | string
  amount: number | string
  currency: string
  containerType?: FclContainerType | string | null
  applyScope?: FclApplyScope
  originCountryCode?: string | null
  destinationCountryCode?: string | null
  cityCode?: string | null
  portCode?: string | null
  terminalCode?: string | null
  warehouseCode?: string | null
  shippingLineCode?: string | null
  validFrom?: string | null
  validTo?: string | null
  isActive?: boolean
  sortOrder?: number
  notes?: string | null
}

export interface FclPricingApiResponse {
  data?: FclServiceCharge[]
  warning?: string
}
