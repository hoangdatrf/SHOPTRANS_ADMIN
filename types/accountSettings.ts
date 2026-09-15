export interface AccountProfileSettings {
  userId: string
  fullName: string
  jobTitle: string
  email: string
  phone: string
  language: string
  avatarDataUrl?: string
}

export interface AccountCompanySettings {
  companyId: string
  companyName: string
  roles: string[]
  taxId: string
  legalRepresentative: string
  website: string
  headOfficeAddress: string
  primaryPort: string
  billingEmail: string
  description: string
  billOfLadingDetails: string
}

export interface LinkedCompanySettings {
  id: string
  name: string
  roles: string[]
  loc: string
  code: string
  contact: string
  bill: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AccountStatsSettings {
  activeShipments: number
  pendingBookings: number
  completedShipments: number
  linkedCompanies: number
}

export interface AccountSecuritySettings {
  status: 'ACTIVE' | 'DEACTIVATION_REQUESTED'
  passwordUpdatedAt?: string | null
  allSessionsLoggedOutAt?: string | null
  deactivationRequestedAt?: string | null
}

export interface AccountSettingsRecord {
  userCode: string
  profile: AccountProfileSettings
  company: AccountCompanySettings
  linkedCompanies: LinkedCompanySettings[]
  stats: AccountStatsSettings
  security: AccountSecuritySettings
  createdAt: string
  updatedAt: string
}

export interface AccountSettingsDb {
  accounts: AccountSettingsRecord[]
}
