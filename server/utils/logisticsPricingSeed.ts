import type { LogisticsPricingDb } from '../../types/logisticsPricing'

const now = '2026-05-31T00:00:00.000Z'

const stamp = <T extends { id: string }>(item: T) => ({
  ...item,
  createdAt: now,
  updatedAt: now,
})

export const createLogisticsPricingSeed = (): LogisticsPricingDb => {
  const countries = [
    stamp({ id: 'country-vn', code: 'VN', name: 'Viet Nam', region: 'Asia', currencyCode: 'VND', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'country-cn', code: 'CN', name: 'China', region: 'Asia', currencyCode: 'CNY', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'country-jp', code: 'JP', name: 'Japan', region: 'Asia', currencyCode: 'JPY', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'country-sg', code: 'SG', name: 'Singapore', region: 'Asia', currencyCode: 'SGD', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'country-kr', code: 'KR', name: 'Korea', region: 'Asia', currencyCode: 'KRW', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'country-th', code: 'TH', name: 'Thailand', region: 'Asia', currencyCode: 'THB', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'country-my', code: 'MY', name: 'Malaysia', region: 'Asia', currencyCode: 'MYR', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'country-us', code: 'US', name: 'United States', region: 'America', currencyCode: 'USD', status: 'ACTIVE' as const, note: '' }),
  ]

  const locations = [
    stamp({ id: 'loc-hcm', countryId: 'country-vn', code: 'HCM', name: 'Ho Chi Minh', type: 'CITY' as const, zipCode: '700000', isPickupLocation: true, isPolPodLocation: true, isCfsLocation: true, isReturnLocation: true, status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'loc-hpg', countryId: 'country-vn', code: 'HPG', name: 'Hai Phong', type: 'CITY' as const, zipCode: '180000', isPickupLocation: true, isPolPodLocation: true, isCfsLocation: true, isReturnLocation: true, status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'loc-dad', countryId: 'country-vn', code: 'DAD', name: 'Da Nang', type: 'CITY' as const, zipCode: '550000', isPickupLocation: true, isPolPodLocation: true, isCfsLocation: false, isReturnLocation: true, status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'loc-bdg', countryId: 'country-vn', code: 'BDG', name: 'Binh Duong', type: 'PROVINCE' as const, zipCode: '750000', isPickupLocation: true, isPolPodLocation: false, isCfsLocation: true, isReturnLocation: true, status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'loc-dna', countryId: 'country-vn', code: 'DNA', name: 'Dong Nai', type: 'PROVINCE' as const, zipCode: '760000', isPickupLocation: true, isPolPodLocation: false, isCfsLocation: true, isReturnLocation: true, status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'loc-brvt', countryId: 'country-vn', code: 'BRVT', name: 'Ba Ria - Vung Tau', type: 'PROVINCE' as const, zipCode: '790000', isPickupLocation: true, isPolPodLocation: true, isCfsLocation: true, isReturnLocation: true, status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'loc-sha', countryId: 'country-cn', code: 'SHA', name: 'Shanghai', type: 'CITY' as const, zipCode: '200000', isPickupLocation: false, isPolPodLocation: true, isCfsLocation: true, isReturnLocation: false, status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'loc-szx', countryId: 'country-cn', code: 'SZX', name: 'Shenzhen', type: 'CITY' as const, zipCode: '518000', isPickupLocation: false, isPolPodLocation: true, isCfsLocation: true, isReturnLocation: false, status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'loc-ngb', countryId: 'country-cn', code: 'NGB', name: 'Ningbo', type: 'CITY' as const, zipCode: '315000', isPickupLocation: false, isPolPodLocation: true, isCfsLocation: true, isReturnLocation: false, status: 'ACTIVE' as const, note: '' }),
  ]

  const ports = [
    stamp({ id: 'port-cli', countryId: 'country-vn', cityId: 'loc-hcm', code: 'CLI', name: 'Cat Lai Port', type: 'SEA_PORT' as const, defaultZipCode: '700000', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'port-hph', countryId: 'country-vn', cityId: 'loc-hpg', code: 'HPH', name: 'Hai Phong Port', type: 'SEA_PORT' as const, defaultZipCode: '180000', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'port-cmit', countryId: 'country-vn', cityId: 'loc-brvt', code: 'CMIT', name: 'Cai Mep Terminal', type: 'SEA_PORT' as const, defaultZipCode: '790000', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'port-sha', countryId: 'country-cn', cityId: 'loc-sha', code: 'SHA', name: 'Shanghai Port', type: 'SEA_PORT' as const, defaultZipCode: '200000', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'port-szx', countryId: 'country-cn', cityId: 'loc-szx', code: 'SZX', name: 'Shenzhen Port', type: 'SEA_PORT' as const, defaultZipCode: '518000', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'port-ngb', countryId: 'country-cn', cityId: 'loc-ngb', code: 'NGB', name: 'Ningbo Port', type: 'SEA_PORT' as const, defaultZipCode: '315000', status: 'ACTIVE' as const, note: '' }),
  ]

  const warehouses = [
    stamp({ id: 'wh-cl1', countryId: 'country-vn', cityId: 'loc-hcm', terminalId: 'terminal-cli-t01', code: 'CLWH1', name: 'Cat Lai WH1', warehouseType: 'CFS' as const, zipCode: '700000', operatorName: 'Transimex', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'wh-cl2', countryId: 'country-vn', cityId: 'loc-hcm', terminalId: 'terminal-cli-t01', code: 'CLWH2', name: 'Cat Lai WH2', warehouseType: 'CFS' as const, zipCode: '700000', operatorName: 'Sotrans', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'wh-hp1', countryId: 'country-vn', cityId: 'loc-hpg', terminalId: 'terminal-hph-t01', code: 'HPWH1', name: 'Hai Phong WH1', warehouseType: 'CFS' as const, zipCode: '180000', operatorName: 'Vinalines Logistics', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'wh-bdicd', countryId: 'country-vn', cityId: 'loc-bdg', code: 'BDICD', name: 'Binh Duong ICD', warehouseType: 'ICD' as const, zipCode: '750000', operatorName: 'Binh Duong Logistics', status: 'ACTIVE' as const, note: '' }),
  ]

  const terminals = [
    stamp({ id: 'terminal-cli-t01', portId: 'port-cli', countryId: 'country-vn', cityId: 'loc-hcm', code: 'CLI-T01', name: 'Cat Lai Terminal', terminalType: 'SEA' as const, defaultZipCode: '700000', linkedWarehouseId: 'wh-cl1', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'terminal-hph-t01', portId: 'port-hph', countryId: 'country-vn', cityId: 'loc-hpg', code: 'HPH-T01', name: 'Hai Phong Terminal', terminalType: 'SEA' as const, defaultZipCode: '180000', linkedWarehouseId: 'wh-hp1', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'terminal-cmit-t01', portId: 'port-cmit', countryId: 'country-vn', cityId: 'loc-brvt', code: 'CMIT-T01', name: 'Cai Mep Terminal', terminalType: 'SEA' as const, defaultZipCode: '790000', status: 'ACTIVE' as const, note: '' }),
  ]

  const shippingLines = [
    stamp({ id: 'line-cosco', code: 'COSCO', name: 'COSCO Shipping', alliance: 'OCEAN Alliance', serviceCoverage: 'Global', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'line-kmtc', code: 'KMTC', name: 'KMTC Line', alliance: 'Independent', serviceCoverage: 'Asia', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'line-sitc', code: 'SITC', name: 'SITC Container Lines', alliance: 'Independent', serviceCoverage: 'Asia', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'line-yml', code: 'YML', name: 'Yang Ming Line', alliance: 'THE Alliance', serviceCoverage: 'Global', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'line-rcl', code: 'RCL', name: 'RCL', alliance: 'Independent', serviceCoverage: 'Asia', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'line-one', code: 'ONE', name: 'Ocean Network Express', alliance: 'THE Alliance', serviceCoverage: 'Global', status: 'ACTIVE' as const, note: '' }),
    stamp({ id: 'line-emc', code: 'EMC', name: 'Evergreen Marine', alliance: 'OCEAN Alliance', serviceCoverage: 'Global', status: 'ACTIVE' as const, note: '' }),
  ]

  const fclRates = [
    stamp({
      id: 'fcl-vn-cn-cosco-001',
      originCountryId: 'country-vn',
      destinationCountryId: 'country-cn',
      polId: 'port-cli',
      podId: 'port-sha',
      shippingLineId: 'line-cosco',
      cargoType: 'GEN',
      serviceType: 'CY_CY' as const,
      directType: 'DIRECT' as const,
      schedule: 'Weekly',
      transitTimeDays: 4,
      freeTime: '7 / 7',
      validityFrom: '2024-01-01',
      validityTo: '2026-12-31',
      currencyCode: 'USD',
      status: 'ACTIVE' as const,
      note: '',
      details: [
        stamp({ id: 'fcld-vn-cn-cosco-20', fclRateId: 'fcl-vn-cn-cosco-001', containerType: '20GP' as const, oceanFreight: 1250, loadingCharge: 35, arrivalCharge: 35, perBillCharge: 40, currencyCode: 'USD' }),
        stamp({ id: 'fcld-vn-cn-cosco-40', fclRateId: 'fcl-vn-cn-cosco-001', containerType: '40GP' as const, oceanFreight: 2150, loadingCharge: 35, arrivalCharge: 35, perBillCharge: 40, currencyCode: 'USD' }),
        stamp({ id: 'fcld-vn-cn-cosco-40hc', fclRateId: 'fcl-vn-cn-cosco-001', containerType: '40HC' as const, oceanFreight: 2450, loadingCharge: 35, arrivalCharge: 35, perBillCharge: 40, currencyCode: 'USD' }),
      ],
    }),
    stamp({
      id: 'fcl-vn-cn-sitc-001',
      originCountryId: 'country-vn',
      destinationCountryId: 'country-cn',
      polId: 'port-hph',
      podId: 'port-szx',
      shippingLineId: 'line-sitc',
      cargoType: 'GEN',
      serviceType: 'CY_CY' as const,
      directType: 'DIRECT' as const,
      schedule: 'Weekly',
      transitTimeDays: 5,
      freeTime: '7 / 7',
      validityFrom: '2024-01-01',
      validityTo: '2026-12-31',
      currencyCode: 'USD',
      status: 'ACTIVE' as const,
      note: '',
      details: [
        stamp({ id: 'fcld-vn-cn-sitc-20', fclRateId: 'fcl-vn-cn-sitc-001', containerType: '20GP' as const, oceanFreight: 1320, loadingCharge: 35, arrivalCharge: 35, perBillCharge: 40, currencyCode: 'USD' }),
        stamp({ id: 'fcld-vn-cn-sitc-40', fclRateId: 'fcl-vn-cn-sitc-001', containerType: '40GP' as const, oceanFreight: 2260, loadingCharge: 35, arrivalCharge: 35, perBillCharge: 40, currencyCode: 'USD' }),
        stamp({ id: 'fcld-vn-cn-sitc-40hc', fclRateId: 'fcl-vn-cn-sitc-001', containerType: '40HC' as const, oceanFreight: 2560, loadingCharge: 35, arrivalCharge: 35, perBillCharge: 40, currencyCode: 'USD' }),
      ],
    }),
  ]

  const lclRates = [
    stamp({
      id: 'lcl-vn-cn-001',
      originCountryId: 'country-vn',
      destinationCountryId: 'country-cn',
      pickupLocationId: 'loc-hcm',
      pickupZipCode: '700000',
      cfsWarehouseId: 'wh-cl1',
      cfsZipCode: '700000',
      podLocationId: 'loc-sha',
      shippingLineId: 'line-sitc',
      distanceKm: 12,
      timeHour: 1,
      validityFrom: '2024-01-01',
      validityTo: '2026-12-31',
      currencyCode: 'USD',
      status: 'ACTIVE' as const,
      note: '',
      details: [
        stamp({ id: 'lcld-vn-cn-001', lclRateId: 'lcl-vn-cn-001', chargeName: 'LCL Ocean Freight', chargeCode: 'LCL_OF', unit: 'PER_WM' as const, perWmAmount: 58, perShipmentAmount: 50, ton1_25Amount: 40, ton2Amount: 50, ton3Amount: 70, ton4Amount: 80, ton5Amount: 95, currencyCode: 'USD' }),
      ],
    }),
  ]

  const chargeRules = [
    stamp({ id: 'charge-customs-clearance-vn', name: 'Customs clearance fee', code: 'CUST_CLR', mode: 'BOTH' as const, chargeGroup: 'CUSTOMS_CLEARANCE' as const, applyScope: 'COUNTRY' as const, originCountryId: 'country-vn', unit: 'PER_CONTAINER' as const, currencyCode: 'USD', amount: 80, isConfirmed: true, isConditional: false, isDefaultIncluded: true, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-inspection-global', name: 'Inspection service fee', code: 'INSP_SVC', mode: 'BOTH' as const, chargeGroup: 'CUSTOMS_CLEARANCE' as const, applyScope: 'GLOBAL' as const, unit: 'PER_CONTAINER' as const, currencyCode: 'USD', amount: 60, isConfirmed: false, isConditional: true, isDefaultIncluded: false, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-inspection-port-actual', name: 'Port fees for inspection', code: 'INSP_PORT_ACTUAL', mode: 'BOTH' as const, chargeGroup: 'PORT_CHARGES' as const, applyScope: 'GLOBAL' as const, unit: 'AS_ACTUAL' as const, currencyCode: 'USD', isConfirmed: false, isConditional: true, isDefaultIncluded: false, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-trucking-hcm', name: 'Trucking fee', code: 'TRK_FEE', mode: 'BOTH' as const, chargeGroup: 'PICKUP_CHARGES' as const, applyScope: 'CITY' as const, cityId: 'loc-hcm', unit: 'PER_TRUCK' as const, currencyCode: 'USD', amount: 350, isConfirmed: true, isConditional: false, isDefaultIncluded: true, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-standby-global', name: 'Trucking standby', code: 'TRK_STANDBY', mode: 'BOTH' as const, chargeGroup: 'PICKUP_CHARGES' as const, applyScope: 'GLOBAL' as const, unit: 'PER_TRUCK' as const, currencyCode: 'USD', amount: 80, isConfirmed: false, isConditional: true, isDefaultIncluded: false, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-cancel-global', name: 'Trucking cancellation fee', code: 'TRK_CANCEL', mode: 'BOTH' as const, chargeGroup: 'PICKUP_CHARGES' as const, applyScope: 'GLOBAL' as const, unit: 'PER_TRUCK' as const, currencyCode: 'USD', amount: 80, isConfirmed: false, isConditional: true, isDefaultIncluded: false, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-lift-on-cli', name: 'Lift on fee', code: 'LIFT_ON', mode: 'FCL' as const, chargeGroup: 'PORT_CHARGES' as const, applyScope: 'PORT' as const, portId: 'port-cli', unit: 'PER_CONTAINER' as const, currencyCode: 'USD', amount: 40, isConfirmed: true, isConditional: false, isDefaultIncluded: true, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-lift-off-cli', name: 'Lift off fee', code: 'LIFT_OFF', mode: 'FCL' as const, chargeGroup: 'PORT_CHARGES' as const, applyScope: 'PORT' as const, portId: 'port-cli', unit: 'PER_CONTAINER' as const, currencyCode: 'USD', amount: 40, isConfirmed: true, isConditional: false, isDefaultIncluded: true, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-thc-cli', name: 'Terminal handling charge', code: 'THC', mode: 'FCL' as const, chargeGroup: 'PORT_CHARGES' as const, applyScope: 'TERMINAL' as const, terminalId: 'terminal-cli-t01', unit: 'PER_CONTAINER' as const, currencyCode: 'USD', amount: 120, isConfirmed: true, isConditional: false, isDefaultIncluded: true, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
    stamp({ id: 'charge-doc-global', name: 'Document fee', code: 'DOC_FEE', mode: 'BOTH' as const, chargeGroup: 'PORT_CHARGES' as const, applyScope: 'GLOBAL' as const, unit: 'PER_BILL' as const, currencyCode: 'USD', amount: 40, isConfirmed: true, isConditional: false, isDefaultIncluded: true, validityFrom: '2024-01-01', validityTo: '2026-12-31', status: 'ACTIVE' as const, note: '', matrix: [] }),
  ]

  return { countries, locations, ports, terminals, warehouses, shippingLines, fclRates, lclRates, chargeRules }
}
