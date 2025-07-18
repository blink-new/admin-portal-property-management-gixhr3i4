export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'superadmin' | 'admin' | 'surveyor' | 'property_manager'
  status: 'active' | 'inactive' | 'banned'
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface Property {
  id: string
  name: string
  neighborhood: string
  street: string
  year: string
  units: string
  floors: string
  serviced: boolean
  unitDetails: UnitDetail[]
  features: PropertyFeatures
  contacts: PropertyContact[]
  photos: PropertyPhoto[]
  location: PropertyLocation
  notes: string
  listingStatus: 'listed' | 'unlisted'
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface PropertyFeatures {
  pool: boolean
  gym: boolean
  sauna: boolean
  steamRoom: boolean
  restaurant: boolean
  shop: boolean
  cctv: boolean
  borehole: boolean
  backupGenerator: boolean
  cinema: boolean
  entertainmentRoom: boolean
  conferenceRoom: boolean
  disabilityAccess: boolean
  garden: boolean
  reservedParking: boolean
  visitorParking: boolean
  elevator: boolean
  rooftopLounge: boolean
  gazebo: boolean
  indoorPlayground: boolean
  outdoorPlayground: boolean
  petFriendly: boolean
  managerOnSite: boolean
  patio: boolean
  laundryMart: boolean
  freeWater: boolean
  freeWifi: boolean
  mannedSecurity: boolean
}

export interface UnitDetail {
  title: string
  type: 'studio' | '1 bedroom' | '2 bedroom' | '3 bedroom' | '4 bedroom' | '5+ bedroom'
  rooms: number
  baths: number
  rent: number
  size: number
  count: number
  masterEnsuite: boolean
  allEnsuite: boolean
  features: UnitFeatures
}

export interface UnitFeatures {
  balcony: boolean
  patio: boolean
  sq: boolean
  fittedKitchen: boolean
  kitchen: 'open-plan' | 'closed-plan'
  electricity: 'pre-paid' | 'post-paid'
  flooring: 'wooden' | 'tiles'
  fireplace: boolean
  solarWater: boolean
  intercom: boolean
  airCon: boolean
  dobbyArea: boolean
  pantry: boolean
}

export interface PropertyContact {
  firstName: string
  lastName: string
  title: 'owner' | 'tenant' | 'caretaker' | 'watchman' | 'property manager'
  email: string
  phone: string
  propertyName: string
  notes: string
}

export interface PropertyLocation {
  lat: number
  lng: number
  formattedAddress: string
  city: string
  country_long: string
  country_short: string
  description: string
  zipcode: string
}

export interface PropertyUnit {
  id: string
  unitNumber: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  rent: number
  status: 'available' | 'occupied' | 'maintenance'
  features: string[]
}

export interface PropertyPhoto {
  id: string
  url: string
  caption?: string
  isPrimary: boolean
  uploadedAt?: string
}

export interface AuditLogEntry {
  id: string
  userId: string
  action: string
  resourceType: string
  resourceId?: string
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface TeamInvitation {
  id: string
  email: string
  role: 'superadmin' | 'admin' | 'surveyor' | 'property_manager'
  invitedBy: string
  status: 'pending' | 'accepted' | 'expired'
  createdAt: string
  expiresAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  tokens: any
}