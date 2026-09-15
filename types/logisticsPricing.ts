export type PricingMode = 'FCL' | 'LCL' | 'BOTH'
export type RecordStatus = 'ACTIVE' | 'DRAFT' | 'INACTIVE'
export type LocationType = 'PROVINCE' | 'CITY'
export type PortType = 'SEA_PORT'
export type TerminalType = 'SEA'
export type WarehouseType = 'CFS' | 'ICD' | 'WAREHOUSE' | 'DEPOT'
export type FclServiceType = 'CY_CY' | 'DOOR_CY' | 'CY_DOOR' | 'DOOR_DOOR'
export type DirectType = 'DIRECT' | 'TRANSHIP'
export type ContainerType = '20GP' | '40GP' | '40HC' | '45HC'
export type ChargeGroup =
  | 'CUSTOMS_CLEARANCE'
  | 'PICKUP_CHARGES'
  | 'PORT_CHARGES'
  | 'ORIGIN_CHARGES'
  | 'OCEAN_FREIGHT'
  | 'DESTINATION_CHARGES'
export type ChargeScope = 'GLOBAL' | 'COUNTRY' | 'CITY' | 'PORT' | 'TERMINAL' | 'WAREHOUSE' | 'ROUTE'
export type ChargeUnit = 'PER_CONTAINER' | 'PER_TRUCK' | 'PER_BILL' | 'PER_WM' | 'AS_ACTUAL'
export type LclUnit = 'PER_WM' | 'PER_SHIPMENT' | 'PER_TON' | 'PER_TRUCK'

export interface AuditFields {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Country extends AuditFields {
  code: string
  name: string
  region: string
  currencyCode: string
  status: RecordStatus
  note?: string
}

export interface Location extends AuditFields {
  countryId: string
  code: string
  name: string
  type: LocationType
  zipCode: string
  isPickupLocation: boolean
  isPolPodLocation: boolean
  isCfsLocation: boolean
  isReturnLocation: boolean
  status: RecordStatus
  note?: string
}

export interface Port extends AuditFields {
  countryId: string
  cityId?: string
  code: string
  name: string
  type: PortType
  defaultZipCode: string
  status: RecordStatus
  note?: string
}

export interface Warehouse extends AuditFields {
  countryId: string
  cityId?: string
  terminalId?: string
  code: string
  name: string
  warehouseType: WarehouseType
  zipCode: string
  operatorName?: string
  status: RecordStatus
  note?: string
}

export interface Terminal extends AuditFields {
  portId: string
  countryId: string
  cityId?: string
  code: string
  name: string
  terminalType: TerminalType
  defaultZipCode: string
  linkedWarehouseId?: string
  status: RecordStatus
  note?: string
}

export interface ShippingLine extends AuditFields {
  code: string
  name: string
  alliance?: string
  serviceCoverage: string
  status: RecordStatus
  note?: string
}

export interface FclRateDetail extends AuditFields {
  fclRateId: string
  containerType: ContainerType
  oceanFreight: number
  localChargeOrigin?: number
  localChargeDestination?: number
  loadingCharge?: number
  arrivalCharge?: number
  perBillCharge?: number
  currencyCode: string
}

export interface FclRate extends AuditFields {
  originCountryId: string
  destinationCountryId: string
  polId: string
  podId: string
  shippingLineId: string
  cargoType: string
  serviceType: FclServiceType
  directType: DirectType
  schedule: string
  transitTimeDays: number
  freeTime: string
  validityFrom: string
  validityTo: string
  currencyCode: string
  status: RecordStatus
  note?: string
  details: FclRateDetail[]
}

export interface LclRateDetail extends AuditFields {
  lclRateId: string
  chargeName: string
  chargeCode: string
  unit: LclUnit
  perWmAmount?: number
  perShipmentAmount?: number
  ton1_25Amount?: number
  ton2Amount?: number
  ton3Amount?: number
  ton4Amount?: number
  ton5Amount?: number
  currencyCode: string
}

export interface LclRate extends AuditFields {
  originCountryId: string
  destinationCountryId: string
  pickupLocationId: string
  pickupZipCode: string
  cfsWarehouseId: string
  cfsZipCode: string
  podLocationId?: string
  shippingLineId?: string
  distanceKm?: number
  timeHour?: number
  validityFrom: string
  validityTo: string
  currencyCode: string
  status: RecordStatus
  note?: string
  details: LclRateDetail[]
}

export interface ChargeRuleMatrix extends AuditFields {
  chargeRuleId: string
  containerType: ContainerType
  amount: number
  enabled: boolean
}

export interface ChargeRule extends AuditFields {
  name: string
  code: string
  mode: PricingMode
  chargeGroup: ChargeGroup
  applyScope: ChargeScope
  originCountryId?: string
  destinationCountryId?: string
  cityId?: string
  portId?: string
  terminalId?: string
  warehouseId?: string
  shippingLineId?: string
  unit: ChargeUnit
  currencyCode: string
  amount?: number
  isConfirmed: boolean
  isConditional: boolean
  isDefaultIncluded: boolean
  validityFrom: string
  validityTo: string
  status: RecordStatus
  note?: string
  matrix: ChargeRuleMatrix[]
}

export interface LogisticsPricingDb {
  countries: Country[]
  locations: Location[]
  ports: Port[]
  terminals: Terminal[]
  warehouses: Warehouse[]
  shippingLines: ShippingLine[]
  fclRates: FclRate[]
  lclRates: LclRate[]
  chargeRules: ChargeRule[]
}

export interface QuoteCalculateInput {
  mode: 'FCL' | 'LCL'
  originCountryId?: string
  destinationCountryId?: string
  pickupLocationId?: string
  polId?: string
  podId?: string
  terminalId?: string
  warehouseId?: string
  shippingLineId?: string
  containerType?: ContainerType
  quantity?: number
  cargoType?: string
  effectiveDate?: string
}
