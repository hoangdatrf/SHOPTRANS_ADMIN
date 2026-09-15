import { computed, onBeforeUnmount, onMounted } from 'vue'
import sourceLocations from '~/data/locations.json'
import sourceCommodities from '~/data/commodities.json'

export const FCL_PAGE_STORAGE_KEY = 'shoptrans-admin-fcl-page-data'

export interface FclPageLocation {
  id: string
  type: string
  city: string
  region: string
  country: string
  countryCode: string
  label: string
  keywords: string[]
  enabled: boolean
}

export interface FclPageCommodity {
  code: string
  name: string
  hsCode: string
  reefer: boolean
  dangerous: boolean
  enabled: boolean
}

export interface FclPageOption {
  id: string
  group: string
  label: string
  enabled: boolean
  deleted?: boolean
}

export interface FclPageContainer {
  id: string
  group: string
  value: string
  label: string
  quoteOnly: boolean
  hideWeight: boolean
  enabled: boolean
}

export interface FclPageData {
  locations: FclPageLocation[]
  commodities: FclPageCommodity[]
  cargoOptions: FclPageOption[]
  containers: FclPageContainer[]
  shippingOptions: FclPageOption[]
  serviceOptions: FclPageOption[]
}

export const createDefaultFclServiceOptions = (): FclPageOption[] => [
  { id: 'fullExw', group: 'AT ORIGIN', label: 'Full EXW service: Door-to-port, customs clearance included', enabled: true },
  { id: 'fullFca', group: 'AT ORIGIN', label: 'Full FCA service: Door-to-port, customs clearance excluded', enabled: true },
  { id: 'origin-customsOnly', group: 'AT ORIGIN', label: 'Customs clearance service only', enabled: true },
  { id: 'origin-collectPay', group: 'AT ORIGIN', label: 'Collect/pay charges as nominated', enabled: true },
  { id: 'origin-insurance', group: 'AT ORIGIN', label: 'Buy cargo insurance', enabled: true },
  { id: 'bookingOffered', group: 'SEA FREIGHT', label: 'Place booking at the offered rate', enabled: true },
  { id: 'bookingSpot', group: 'SEA FREIGHT', label: 'Place booking at SPOT rate', enabled: true },
  { id: 'handleUnderAvailable', group: 'SEA FREIGHT', label: 'Handle the shipment under an available booking', enabled: true },
  { id: 'serviceContract', group: 'SEA FREIGHT', label: 'Place booking under SC/quotation', enabled: true },
  { id: 'switchBill', group: 'SEA FREIGHT', label: 'Switch bill of lading', enabled: true },
  { id: 'dap', group: 'AT DESTINATION', label: 'Full DAP service: Port-to-door, customs clearance excluded', enabled: true },
  { id: 'ddu', group: 'AT DESTINATION', label: 'Full DDU service: Port-to-door, import duty excluded', enabled: true },
  { id: 'ddp', group: 'AT DESTINATION', label: 'Full DDP service: Port-to-door, import duty included', enabled: true },
  { id: 'dest-customsOnly', group: 'AT DESTINATION', label: 'Customs clearance service only', enabled: true },
  { id: 'dest-collectPay', group: 'AT DESTINATION', label: 'Collect/pay charges as nominated', enabled: true },
  { id: 'dest-insurance', group: 'AT DESTINATION', label: 'Buy cargo insurance', enabled: true },
  { id: 'dodRelease', group: 'AT DESTINATION', label: 'Consignee Delivery Order (D/O) Release Service', enabled: true }
]

const sourceContainerGroups = [
  {
    title: 'GENERAL PURPOSE',
    items: [
      { value: '20GP', label: "20' General Purpose (20GP)" },
      { value: '40GP', label: "40' General Purpose (40GP)" }
    ]
  },
  {
    title: 'HIGH CUBE',
    items: [
      { value: '40HC', label: "40' High Cube (40HC)" },
      { value: '45HC', label: "45' High Cube (45HC)" }
    ]
  },
  {
    title: 'REEFER',
    items: [
      { value: '20RF', label: "20' Reefer (20RF)" },
      { value: '40RF', label: "40' Reefer (40RF)" }
    ]
  },
  {
    title: 'OPEN TOP',
    items: [
      { value: '20OT', label: "20' Open Top (20OT)", hideWeight: true },
      { value: '40OT', label: "40' Open Top (40OT)", hideWeight: true }
    ]
  },
  {
    title: 'FLAT RACK',
    items: [
      { value: '20FR', label: "20' Flat Rack (20FR)", hideWeight: true },
      { value: '40FR', label: "40' Flat Rack (40FR)", hideWeight: true }
    ]
  }
]

export const createDefaultFclPageData = (): FclPageData => ({
  locations: (sourceLocations as any[]).map((item, index) => ({
    id: String(item.id || `location-${index + 1}`),
    type: String(item.type || 'location'),
    city: String(item.city || ''),
    region: String(item.region || item.country || ''),
    country: String(item.country || item.region || ''),
    countryCode: String(item.countryCode || ''),
    label: String(item.label || item.city || ''),
    keywords: Array.isArray(item.keywords) ? item.keywords.map((keyword: any) => String(keyword)) : [],
    enabled: item.enabled !== false
  })),
  commodities: (sourceCommodities as any[]).map((item, index) => ({
    code: String(item.code || `COM${String(index + 1).padStart(3, '0')}`),
    name: String(item.name || ''),
    hsCode: String(item.hsCode || ''),
    reefer: Boolean(item.reefer),
    dangerous: Boolean(item.dangerous),
    enabled: item.enabled !== false
  })),
  cargoOptions: [
    { id: 'cargo-condition-new', group: 'Cargo condition', label: '100% new cargo', enabled: true },
    { id: 'cargo-condition-used', group: 'Cargo condition', label: 'Used cargo', enabled: true },
    { id: 'cargo-temp-control', group: 'Cargo flags', label: 'This cargo requires temperature control', enabled: true },
    { id: 'cargo-dangerous', group: 'Cargo flags', label: 'This cargo is considered dangerous', enabled: true }
  ],
  containers: sourceContainerGroups.flatMap(group => group.items.map(item => ({
    id: `container-${item.value}`,
    group: group.title,
    value: item.value,
    label: item.label,
    quoteOnly: ['20OT', '40OT', '20FR', '40FR'].includes(item.value),
    hideWeight: Boolean((item as any).hideWeight),
    enabled: true
  }))),
  shippingOptions: [
    { id: 'quantity', group: 'Container controls', label: 'Quantity stepper', enabled: true },
    { id: 'weight-kg', group: 'Cargo weight unit', label: 'kg', enabled: true },
    { id: 'weight-lbs', group: 'Cargo weight unit', label: 'lbs', enabled: true },
    { id: 'soc-container', group: 'Container flags', label: 'It is SOC container (Shipper-Owned Container)', enabled: true },
    { id: 'dangerous-disables-soc', group: 'Container rules', label: 'Disable SOC when dangerous cargo is declared', enabled: true },
    { id: 'reefer-only-temp-control', group: 'Container rules', label: 'Temperature control only allows reefer containers', enabled: true }
  ],
  serviceOptions: createDefaultFclServiceOptions()
})

const normalizeFclPageData = (input: Partial<FclPageData> | null | undefined): FclPageData => {
  const defaults = createDefaultFclPageData()

  return {
    locations: Array.isArray(input?.locations) ? input.locations : defaults.locations,
    commodities: Array.isArray(input?.commodities) ? input.commodities : defaults.commodities,
    cargoOptions: Array.isArray(input?.cargoOptions) ? input.cargoOptions : defaults.cargoOptions,
    containers: Array.isArray(input?.containers) ? input.containers : defaults.containers,
    shippingOptions: Array.isArray(input?.shippingOptions) ? input.shippingOptions : defaults.shippingOptions,
    serviceOptions: Array.isArray(input?.serviceOptions) ? input.serviceOptions : defaults.serviceOptions
  }
}

export const loadFclPageDataSnapshot = (): FclPageData => {
  if (!process.client) return createDefaultFclPageData()

  try {
    const saved = window.localStorage.getItem(FCL_PAGE_STORAGE_KEY)
    return saved ? normalizeFclPageData(JSON.parse(saved)) : createDefaultFclPageData()
  } catch {
    return createDefaultFclPageData()
  }
}

export const useFclPageData = () => {
  const fclPageData = useState<FclPageData>('shoptrans-fcl-page-data', createDefaultFclPageData)
  const refreshFclPageData = () => {
    fclPageData.value = loadFclPageDataSnapshot()
  }
  const handleStorageUpdate = (event: StorageEvent) => {
    if (event.key === FCL_PAGE_STORAGE_KEY || event.key === null) {
      refreshFclPageData()
    }
  }

  onMounted(() => {
    refreshFclPageData()
    window.addEventListener('storage', handleStorageUpdate)
  })

  onBeforeUnmount(() => {
    if (process.client) window.removeEventListener('storage', handleStorageUpdate)
  })

  return {
    fclPageData,
    activeFclLocations: computed(() => fclPageData.value.locations.filter((item: any) => item.enabled !== false && !item.deleted)),
    activeFclCommodities: computed(() => fclPageData.value.commodities.filter((item: any) => item.enabled !== false && !item.deleted)),
    activeFclCargoOptions: computed(() => fclPageData.value.cargoOptions.filter((item: any) => item.enabled !== false && !item.deleted)),
    activeFclContainers: computed(() => fclPageData.value.containers.filter((item: any) => item.enabled !== false && !item.deleted)),
    activeFclShippingOptions: computed(() => fclPageData.value.shippingOptions.filter((item: any) => item.enabled !== false && !item.deleted)),
    activeFclServiceOptions: computed(() => (fclPageData.value.serviceOptions || []).filter((item: any) => item.enabled !== false && !item.deleted)),
    refreshFclPageData
  }
}
