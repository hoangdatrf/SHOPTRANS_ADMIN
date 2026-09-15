export const salesMarketingTopTabs = ['At Origin', 'Main Freight', 'At Destination', 'MassSales']
export const salesModes = ['FCL', 'LCL', 'AIR']
export const salesCurrencyOptions = ['USD', 'VND', 'CNY', 'JPY']

export const salesField = (key, label, w = 120, extra = {}) => ({ key, label, w, ...extra })
export const salesStatusNotesFields = () => [
  salesField('status', 'Status', 112, { kind: 'select', opts: ['Active', 'Inactive'] }),
  salesField('notes', 'Notes', 200),
]

const withSalesStatusNotes = (columns) => [...columns, ...salesStatusNotesFields()]
const salesCurrencyField = () => salesField('currency', 'Currency', 100, { kind: 'select', opts: salesCurrencyOptions })

const pricedColumns = (units, defaultWidth = 95) => {
  const groups = { cost: [], sell: [], mgn: [] }
  for (const [key, unit, width = defaultWidth] of units) {
    groups.cost.push(salesField(`${key}_cost`, `Cost/${unit}`, width, { kind: 'number', optional: true }))
    groups.sell.push(salesField(`${key}_sell`, `Sell/${unit}`, width, { kind: 'number', optional: true }))
    groups.mgn.push(salesField(`${key}_mgn`, `Margin/${unit}`, width, { kind: 'computed', optional: true }))
  }
  return [...groups.cost, ...groups.sell, ...groups.mgn]
}

const portReference = (key, label, w, listId) => salesField(key, label, w, { kind: 'list', listId, noAdd: true })
const validityField = () => salesField('validity', 'Validity', 130, { kind: 'date', optional: true })

const feeFcl = (extraFields = [], includeBl = true) => {
  const units = [['r20gp', '20GP'], ['r40gp', '40GP'], ['r40hc', '40HC'], ['r45hc', '45HC']]
  if (includeBl) units.push(['ratebl', 'BL'])
  return withSalesStatusNotes([
    portReference('scope', 'PortCode', 180, 'dlPortCode'),
    ...extraFields,
    salesCurrencyField(),
    ...pricedColumns(units),
    validityField(),
  ])
}

const feeSetLcl = (extraFields = []) => withSalesStatusNotes([
  portReference('scope', 'PortCode', 180, 'dlPortCode'),
  ...extraFields,
  salesCurrencyField(),
  ...pricedColumns([['rateset', 'Set']], 100),
  validityField(),
])

const truckLead = (mode) => mode === 'dest'
  ? [
      portReference('scope', 'FromPortCode', 160, 'dlPortCode'),
      portReference('portname', 'PortName', 180, 'dlPortName'),
      portReference('district', 'To Ward/Commune', 150, 'dlWard'),
      portReference('postalcode', 'PostalCode', 120, 'dlPostal'),
    ]
  : [
      portReference('district', 'From Ward/Commune', 160, 'dlWard'),
      portReference('postalcode', 'PostalCode', 120, 'dlPostal'),
      portReference('scope', 'ToPortCode', 160, 'dlPortCode'),
      portReference('portname', 'PortName', 180, 'dlPortName'),
    ]

const truckWeightUnits = [
  ['rle1t', '≤1T'],
  ['r1_3t', '1–3T'],
  ['r3_5t', '3–5T'],
  ['r5_10t', '5–10T'],
  ['r10_15t', '10–15T'],
  ['r15_25t', '15–25T'],
]

const feeTruckSet = (mode) => withSalesStatusNotes([
  ...truckLead(mode),
  salesCurrencyField(),
  ...pricedColumns(truckWeightUnits, 100),
  validityField(),
])

const feeTruckFcl = (mode) => withSalesStatusNotes([
  ...truckLead(mode),
  salesCurrencyField(),
  ...pricedColumns([['r20gp', '20GP'], ['r40gp', '40GP'], ['r40hc', '40HC'], ['r45hc', '45HC']]),
  validityField(),
])

const feeWm = (portLabel = 'PortCode', rateLabel = 'WM', perKg = false) => withSalesStatusNotes([
  portReference('scope', portLabel, 180, 'dlPortCode'),
  salesCurrencyField(),
  ...pricedColumns([['ratewm', perKg ? rateLabel || 'KGS' : rateLabel || 'WM']], perKg ? 110 : 100),
  validityField(),
])

const airLabels = (fields) => fields.map((field) => {
  if (!['scope', 'portcode', 'pol', 'pod', 'portname'].includes(field.key)) return field
  const next = {
    ...field,
    label: String(field.label).replace(/PORTCODE/, 'AirportCode').replace(/PortCode/, 'AirportCode'),
  }
  if (next.listId === 'dlPortCode') next.listId = 'dlAirportCode'
  if (next.listId === 'dlPortName') next.listId = 'dlAirportName'
  return next
})

const scheduleFields = () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  .map((day) => salesField(`sch_${day.toLowerCase()}`, day, 52, { kind: 'checkbox', optional: true }))

const feeMainRateFcl = () => withSalesStatusNotes([
  portReference('pol', 'Origin', 110, 'dlPortCode'),
  portReference('pod', 'Destination', 110, 'dlPortCode'),
  salesField('carrier', 'Carrier', 130),
  salesCurrencyField(),
  ...pricedColumns([['r20gp', '20GP'], ['r40gp', '40GP'], ['r40hc', '40HC'], ['r45hc', '45HC']], 112),
  ...scheduleFields(),
  salesField('rtype', 'Type', 100, { kind: 'select', opts: ['Direct', 'Via'], optional: true }),
  salesField('ttdays', 'TT/Days', 90, { kind: 'number', optional: true }),
  salesField('dem', 'Freetime DEM', 110, { kind: 'number', optional: true }),
  salesField('det', 'Freetime DET', 110, { kind: 'number', optional: true }),
  validityField(),
])

const feeMainRateLclAir = (rateUnit = 'WM') => withSalesStatusNotes([
  portReference('pol', 'Origin', 110, 'dlPortCode'),
  portReference('pod', 'Destination', 110, 'dlPortCode'),
  salesField('carrier', 'Carrier', 130),
  salesCurrencyField(),
  ...pricedColumns([['ratewm', rateUnit]], 112),
  ...scheduleFields(),
  salesField('rtype', 'Type', 100, { kind: 'select', opts: ['Direct', 'Via'], optional: true }),
  salesField('ttdays', 'TT/Days', 90, { kind: 'number', optional: true }),
  salesField('via', 'Via', 110, { optional: true }),
  validityField(),
])

const feeMainSurchargeFcl = () => withSalesStatusNotes([
  portReference('pol', 'Origin', 110, 'dlPortCode'),
  portReference('pod', 'Destination', 110, 'dlPortCode'),
  salesField('carrier', 'Carrier', 130),
  salesCurrencyField(),
  ...pricedColumns([['r20gp', '20GP'], ['r40gp', '40GP'], ['r40hc', '40HC'], ['r45hc', '45HC'], ['ratebl', 'BL']], 112),
  validityField(),
])

const feeMainSurchargeLclAir = (rateUnit = 'WM') => withSalesStatusNotes([
  portReference('pol', 'Origin', 110, 'dlPortCode'),
  portReference('pod', 'Destination', 110, 'dlPortCode'),
  salesField('carrier', 'Carrier', 130),
  salesCurrencyField(),
  ...pricedColumns([['ratewm', rateUnit], ['ratebl', 'BL']], 112),
  validityField(),
])

const feeMainOriginDestFcl = () => withSalesStatusNotes([
  portReference('portcode', 'PortCode', 120, 'dlPortCode'),
  salesField('chargename', 'ChargeName', 180),
  salesCurrencyField(),
  ...pricedColumns([['rc20gp', '20GP'], ['rc40gp', '40GP'], ['rc40hc', '40HC'], ['rc45hc', '45HC'], ['ratebl', 'BL']], 112),
  validityField(),
])

const feeMainOriginDestLclAir = (rateUnit = 'WM') => withSalesStatusNotes([
  portReference('portcode', 'PortCode', 120, 'dlPortCode'),
  salesField('chargename', 'ChargeName', 180),
  salesCurrencyField(),
  ...pricedColumns([['ratewm', rateUnit], ['ratebl', 'BL']], 112),
  validityField(),
])

export const salesFeeTabs = {
  'At Origin': {
    FCL: [
      { id: 'origin_fcl_clearance', label: 'Clearance Fee', columns: feeFcl() },
      { id: 'origin_fcl_inspection', label: 'Inspection Fee', columns: feeFcl() },
      { id: 'origin_fcl_trucking', label: 'Trucking Fee', columns: feeTruckFcl('origin') },
      { id: 'origin_fcl_truckdet', label: 'Truck Detention Fee', columns: feeFcl() },
      { id: 'origin_fcl_lolo', label: 'LOLO Fee', columns: feeFcl([], false) },
      { id: 'origin_fcl_port', label: 'Port Fee', columns: feeFcl([], false) },
    ],
    LCL: [
      { id: 'origin_lcl_clearance', label: 'Clearance Fee', columns: feeSetLcl() },
      { id: 'origin_lcl_inspection', label: 'Inspection Fee', columns: feeSetLcl() },
      { id: 'origin_lcl_trucking', label: 'Trucking Fee', columns: feeTruckSet('origin') },
      { id: 'origin_lcl_truckdet', label: 'Truck Detention Fee', columns: feeSetLcl() },
      { id: 'origin_lcl_warehouse', label: 'Warehouse Fee', columns: feeWm() },
    ],
    AIR: [
      { id: 'origin_air_clearance', label: 'Clearance Fee', columns: airLabels(feeSetLcl()) },
      { id: 'origin_air_inspection', label: 'Inspection Fee', columns: airLabels(feeSetLcl()) },
      { id: 'origin_air_trucking', label: 'Trucking Fee', columns: airLabels(feeTruckSet('origin')) },
      { id: 'origin_air_truckdet', label: 'Truck Detention Fee', columns: airLabels(feeSetLcl()) },
      { id: 'origin_air_warehouse', label: 'Warehouse Fee', columns: airLabels(feeWm('AirportCode', 'KGS', true)) },
    ],
  },
  'Main Freight': {
    FCL: [
      { id: 'mf_fcl_rate', label: 'Rate', columns: feeMainRateFcl() },
      { id: 'mf_fcl_surcharge', label: 'Freight Surcharges', columns: feeMainSurchargeFcl() },
      { id: 'mf_fcl_origin', label: 'Origin charges', columns: feeMainOriginDestFcl() },
      { id: 'mf_fcl_dest', label: 'Destination charges', columns: feeMainOriginDestFcl() },
    ],
    LCL: [
      { id: 'mf_lcl_rate', label: 'Rate', columns: feeMainRateLclAir('WM') },
      { id: 'mf_lcl_surcharge', label: 'Freight Surcharges', columns: feeMainSurchargeLclAir('WM') },
      { id: 'mf_lcl_origin', label: 'Origin charges', columns: feeMainOriginDestLclAir('WM') },
      { id: 'mf_lcl_dest', label: 'Destination charges', columns: feeMainOriginDestLclAir('WM') },
    ],
    AIR: [
      { id: 'mf_air_rate', label: 'Rate', columns: airLabels(feeMainRateLclAir('KGS')) },
      { id: 'mf_air_surcharge', label: 'Freight Surcharges', columns: airLabels(feeMainSurchargeLclAir('KGS')) },
      { id: 'mf_air_origin', label: 'Origin charges', columns: airLabels(feeMainOriginDestLclAir('KGS')) },
      { id: 'mf_air_dest', label: 'Destination charges', columns: airLabels(feeMainOriginDestLclAir('KGS')) },
    ],
  },
  'At Destination': {
    FCL: [
      { id: 'dest_fcl_handling', label: 'Handling Fee', columns: feeFcl() },
      { id: 'dest_fcl_clearance', label: 'Clearance Fee', columns: feeFcl() },
      { id: 'dest_fcl_inspection', label: 'Inspection Fee', columns: feeFcl() },
      { id: 'dest_fcl_trucking', label: 'Trucking Fee', columns: feeTruckFcl('dest') },
      { id: 'dest_fcl_truckdet', label: 'Truck Detention Fee', columns: feeFcl() },
      { id: 'dest_fcl_lolo', label: 'LOLO Fee', columns: feeFcl([], false) },
      { id: 'dest_fcl_port', label: 'Port Fee', columns: feeFcl([], false) },
    ],
    LCL: [
      { id: 'dest_lcl_handling', label: 'Handling Fee', columns: feeSetLcl() },
      { id: 'dest_lcl_clearance', label: 'Clearance Fee', columns: feeSetLcl() },
      { id: 'dest_lcl_inspection', label: 'Inspection Fee', columns: feeSetLcl() },
      { id: 'dest_lcl_trucking', label: 'Trucking Fee', columns: feeTruckSet('dest') },
      { id: 'dest_lcl_truckdet', label: 'Truck Detention Fee', columns: feeSetLcl() },
      { id: 'dest_lcl_warehouse', label: 'Warehouse Fee', columns: feeWm() },
    ],
    AIR: [
      { id: 'dest_air_handling', label: 'Handling Fee', columns: airLabels(feeSetLcl()) },
      { id: 'dest_air_clearance', label: 'Clearance Fee', columns: airLabels(feeSetLcl()) },
      { id: 'dest_air_inspection', label: 'Inspection Fee', columns: airLabels(feeSetLcl()) },
      { id: 'dest_air_trucking', label: 'Trucking Fee', columns: airLabels(feeTruckSet('dest')) },
      { id: 'dest_air_truckdet', label: 'Truck Detention Fee', columns: airLabels(feeSetLcl()) },
      { id: 'dest_air_warehouse', label: 'Warehouse Fee', columns: airLabels(feeWm('AirportCode', 'KGS', true)) },
    ],
  },
}

export const findSalesFeeTabId = (top, mode, preferredLabel = '') => {
  const tabs = salesFeeTabs[top]?.[mode] || []
  return (tabs.find((tab) => tab.label === preferredLabel) || tabs[0])?.id || ''
}
