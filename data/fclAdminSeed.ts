export const countries = [
  { code: 'VN', flag: 'VN', name: 'Viet Nam', region: 'Asia', currency: 'VND', ports: 32, warehouses: 56, status: 'Active' },
  { code: 'CN', flag: 'CN', name: 'China', region: 'Asia', currency: 'CNY', ports: 45, warehouses: 78, status: 'Active' },
  { code: 'SG', flag: 'SG', name: 'Singapore', region: 'Asia', currency: 'SGD', ports: 16, warehouses: 27, status: 'Active' },
  { code: 'TH', flag: 'TH', name: 'Thailand', region: 'Asia', currency: 'THB', ports: 18, warehouses: 31, status: 'Active' },
  { code: 'JP', flag: 'JP', name: 'Japan', region: 'Asia', currency: 'JPY', ports: 24, warehouses: 23, status: 'Active' },
  { code: 'KR', flag: 'KR', name: 'Korea', region: 'Asia', currency: 'KRW', ports: 15, warehouses: 20, status: 'Active' },
  { code: 'MY', flag: 'MY', name: 'Malaysia', region: 'Asia', currency: 'MYR', ports: 11, warehouses: 18, status: 'Inactive' },
  { code: 'ID', flag: 'ID', name: 'Indonesia', region: 'Asia', currency: 'IDR', ports: 22, warehouses: 26, status: 'Active' },
  { code: 'PH', flag: 'PH', name: 'Philippines', region: 'Asia', currency: 'PHP', ports: 12, warehouses: 17, status: 'Active' },
  { code: 'IN', flag: 'IN', name: 'India', region: 'Asia', currency: 'INR', ports: 19, warehouses: 24, status: 'Active' },
]

export const vietnamLocations = [
  { no: 1, name: 'Ho Chi Minh', code: 'HCM', zip: '700000', type: 'City', status: 'Active' },
  { no: 2, name: 'Hai Phong', code: 'HPG', zip: '180000', type: 'City', status: 'Active' },
  { no: 3, name: 'Da Nang', code: 'DAD', zip: '550000', type: 'City', status: 'Active' },
  { no: 4, name: 'Binh Duong', code: 'BDG', zip: '750000', type: 'Province', status: 'Active' },
  { no: 5, name: 'Dong Nai', code: 'DNA', zip: '760000', type: 'Province', status: 'Active' },
  { no: 6, name: 'Can Tho', code: 'CTO', zip: '940000', type: 'City', status: 'Active' },
  { no: 7, name: 'Quang Ninh', code: 'QNH', zip: '200000', type: 'Province', status: 'Active' },
  { no: 8, name: 'Ba Ria - Vung Tau', code: 'BRVT', zip: '790000', type: 'Province', status: 'Active' },
]

export const portTerminalRows = [
  { code: 'CLI', name: 'Cat Lai Terminal', country: 'Viet Nam', city: 'Ho Chi Minh', type: 'Sea', linked: 'Cat Lai WH1', status: 'Active' },
  { code: 'HPH', name: 'Hai Phong Port', country: 'Viet Nam', city: 'Hai Phong', type: 'Sea', linked: 'Hai Phong WH1', status: 'Active' },
  { code: 'CMIT', name: 'Cai Mep Terminal', country: 'Viet Nam', city: 'Ba Ria - Vung Tau', type: 'Sea', linked: 'Cai Mep WH1', status: 'Active' },
  { code: 'TCIT', name: 'Tan Cang - Cat Lai', country: 'Viet Nam', city: 'Ho Chi Minh', type: 'Sea', linked: 'Cat Lai WH2', status: 'Active' },
  { code: 'HICT', name: 'HICT Terminal', country: 'Viet Nam', city: 'Hai Phong', type: 'Sea', linked: 'Hai Phong WH2', status: 'Active' },
  { code: 'SPIT', name: 'SP-SSA Terminal', country: 'Viet Nam', city: 'Ho Chi Minh', type: 'Sea', linked: 'Cat Lai WH3', status: 'Active' },
  { code: 'VIPT', name: 'VIP Green Port', country: 'Viet Nam', city: 'Hai Phong', type: 'Sea', linked: 'Hai Phong WH3', status: 'Active' },
  { code: 'DNP', name: 'Da Nang Port', country: 'Viet Nam', city: 'Da Nang', type: 'Sea', linked: 'Da Nang WH1', status: 'Active' },
  { code: 'ICDLA', name: 'ICD Long An', country: 'Viet Nam', city: 'Long An', type: 'Inland', linked: 'Long An WH1', status: 'Active' },
  { code: 'CATLWH', name: 'Cat Lai WH1', country: 'Viet Nam', city: 'Ho Chi Minh', type: 'Warehouse', linked: '-', status: 'Active' },
  { code: 'CATLWH2', name: 'Cat Lai WH2', country: 'Viet Nam', city: 'Ho Chi Minh', type: 'Warehouse', linked: '-', status: 'Active' },
  { code: 'CATLWH3', name: 'Cat Lai WH3', country: 'Viet Nam', city: 'Ho Chi Minh', type: 'Warehouse', linked: '-', status: 'Inactive' },
]

export const connectedWarehouses = [
  { name: 'Cat Lai WH1', code: 'CLWH1', zip: '700000', operator: 'Transimex', status: 'Active' },
  { name: 'Cat Lai WH2', code: 'CLWH2', zip: '700000', operator: 'Sotrans', status: 'Active' },
  { name: 'Cat Lai WH3', code: 'CLWH3', zip: '700000', operator: 'Vinalines Logistics', status: 'Active' },
]

export const shippingLines = [
  { name: 'COSCO Shipping', code: 'COSCO', alliance: 'OCEAN Alliance', coverage: 'Global', status: 'Active' },
  { name: 'KMTC Line', code: 'KMTC', alliance: 'Independent', coverage: 'Asia', status: 'Active' },
  { name: 'Yang Ming Line', code: 'YML', alliance: 'THE Alliance', coverage: 'Global', status: 'Active' },
  { name: 'SITC Container Lines', code: 'SITC', alliance: 'Independent', coverage: 'Asia', status: 'Active' },
  { name: 'EMC Line', code: 'EMC', alliance: 'Independent', coverage: 'Asia', status: 'Active' },
]

export const fclRates = [
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'CN China', pol: 'HCM', pod: 'Shanghai', line: 'COSCO', type: '20GP', rate: '1,250', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'CN China', pol: 'HCM', pod: 'Shanghai', line: 'COSCO', type: '40GP', rate: '2,150', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'CN China', pol: 'HCM', pod: 'Shanghai', line: 'COSCO', type: '40HC', rate: '2,450', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'CN China', pol: 'Hai Phong', pod: 'Shenzhen', line: 'OOCL', type: '20GP', rate: '1,320', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'CN China', pol: 'Hai Phong', pod: 'Shenzhen', line: 'OOCL', type: '40GP', rate: '2,260', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'US United States', pol: 'HCM', pod: 'Los Angeles', line: 'HMM', type: '40HC', rate: '3,650', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'KR Korea', pol: 'HCM', pod: 'Busan', line: 'KMTC', type: '20GP', rate: '980', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'JP Japan', pol: 'HCM', pod: 'Tokyo', line: 'ONE', type: '20GP', rate: '1,100', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
  { mode: 'FCL', origin: 'VN Viet Nam', destination: 'MY Malaysia', pol: 'HCM', pod: 'Port Klang', line: 'MISC', type: '20GP', rate: '750', from: '2024-05-01', to: '2024-07-31', status: 'Active' },
]

export const localCharges = [
  { name: 'Trucking Fee', code: 'TRK_FEE', apply: ['city', 'port', 'bill'], basis: 'Per Move', ft20: 120, ft40: 180, ft45: 200, bill: 80, status: 'Active' },
  { name: 'Customs Clearance Fee', code: 'CUST_CLR', apply: ['city', 'port', 'bill'], basis: 'Per B/L', ft20: 90, ft40: 130, ft45: 150, bill: 70, status: 'Active' },
  { name: 'Container Inspection Fee', code: 'CINS_FEE', apply: ['city', 'port'], basis: 'Per Container', ft20: 60, ft40: 60, ft45: 70, bill: 50, status: 'Active' },
  { name: 'Lift On Fee', code: 'LIFT_ON', apply: ['port', 'bill'], basis: 'Per Container', ft20: 40, ft40: 50, ft45: 55, bill: 35, status: 'Active' },
  { name: 'Lift Off Fee', code: 'LIFT_OFF', apply: ['port', 'bill'], basis: 'Per Container', ft20: 40, ft40: 50, ft45: 55, bill: 35, status: 'Active' },
  { name: 'Port Fee', code: 'PORT_FEE', apply: ['port'], basis: 'Per B/L', ft20: 75, ft40: 110, ft45: 120, bill: 60, status: 'Active' },
]
