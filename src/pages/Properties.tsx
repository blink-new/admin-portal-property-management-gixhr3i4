import React, { useState, useEffect } from 'react'
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, MapPin, Building2, Upload, X, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Switch } from '../components/ui/switch'
import { Checkbox } from '../components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible'
import { Property, PropertyFeatures, UnitDetail, UnitFeatures, PropertyContact, PropertyLocation, PropertyPhoto } from '../types'
import { useToast } from '../hooks/use-toast'

const Properties: React.FC = () => {
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // Predefined neighborhoods
  const neighborhoods = [
    'Downtown', 'Westside', 'Eastside', 'Midtown', 'Uptown', 'Riverside', 
    'Hillcrest', 'Oakwood', 'Maplewood', 'Sunset District'
  ]

  // Form state for creating new property
  const [formData, setFormData] = useState({
    name: '',
    neighborhood: '',
    street: '',
    year: '',
    units: '',
    floors: '',
    serviced: false,
    unitDetails: [] as UnitDetail[],
    features: {
      pool: false,
      gym: false,
      sauna: false,
      steamRoom: false,
      restaurant: false,
      shop: false,
      cctv: false,
      borehole: false,
      backupGenerator: false,
      cinema: false,
      entertainmentRoom: false,
      conferenceRoom: false,
      disabilityAccess: false,
      garden: false,
      reservedParking: false,
      visitorParking: false,
      elevator: false,
      rooftopLounge: false,
      gazebo: false,
      indoorPlayground: false,
      outdoorPlayground: false,
      petFriendly: false,
      managerOnSite: false,
      patio: false,
      laundryMart: false,
      freeWater: false,
      freeWifi: false,
      mannedSecurity: false,
    } as PropertyFeatures,
    contacts: [] as PropertyContact[],
    photos: [] as PropertyPhoto[],
    location: {} as PropertyLocation,
    notes: '',
  })

  const [newNeighborhood, setNewNeighborhood] = useState('')
  const [showNewNeighborhood, setShowNewNeighborhood] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    features: false,
    units: false,
    contacts: false,
    photos: false,
    location: false,
  })

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const mockProperties: Property[] = [
          {
            id: '1',
            name: 'Sunset Apartments',
            neighborhood: 'Downtown',
            street: '123 Main Street',
            year: '2020',
            units: '24',
            floors: '6',
            serviced: true,
            unitDetails: [
              {
                title: 'Standard Studio',
                type: 'studio',
                rooms: 1,
                baths: 1,
                rent: 1800,
                size: 450,
                count: 8,
                masterEnsuite: false,
                allEnsuite: true,
                features: {
                  balcony: true,
                  patio: false,
                  sq: false,
                  fittedKitchen: true,
                  kitchen: 'open-plan',
                  electricity: 'pre-paid',
                  flooring: 'tiles',
                  fireplace: false,
                  solarWater: true,
                  intercom: true,
                  airCon: true,
                  dobbyArea: false,
                  pantry: false,
                }
              }
            ],
            features: {
              pool: true,
              gym: true,
              sauna: false,
              steamRoom: false,
              restaurant: false,
              shop: false,
              cctv: true,
              borehole: false,
              backupGenerator: true,
              cinema: false,
              entertainmentRoom: false,
              conferenceRoom: false,
              disabilityAccess: true,
              garden: false,
              reservedParking: true,
              visitorParking: true,
              elevator: true,
              rooftopLounge: false,
              gazebo: false,
              indoorPlayground: false,
              outdoorPlayground: false,
              petFriendly: false,
              managerOnSite: true,
              patio: false,
              laundryMart: true,
              freeWater: false,
              freeWifi: true,
              mannedSecurity: true,
            },
            contacts: [
              {
                firstName: 'John',
                lastName: 'Manager',
                title: 'property manager',
                email: 'john@example.com',
                phone: '(555) 123-4567',
                propertyName: 'Sunset Apartments',
                notes: 'Available 9-5 weekdays'
              }
            ],
            photos: [
              {
                id: 'photo-1',
                url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
                caption: 'Building exterior',
                isPrimary: true
              },
              {
                id: 'photo-2', 
                url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
                caption: 'Lobby area',
                isPrimary: false
              }
            ],
            location: {
              lat: 37.7749,
              lng: -122.4194,
              formattedAddress: '123 Main Street, San Francisco, CA 94102',
              city: 'San Francisco',
              country_long: 'United States',
              country_short: 'US',
              description: 'Downtown location',
              zipcode: '94102'
            },
            notes: 'Modern apartment complex with great amenities',
            listingStatus: 'listed',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            createdBy: 'admin-1'
          }
        ]
        setProperties(mockProperties)
      } catch (error) {
        console.error('Failed to fetch properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesNeighborhood = selectedNeighborhood === 'all' || property.neighborhood === selectedNeighborhood
    const matchesStatus = selectedStatus === 'all' || property.listingStatus === selectedStatus
    
    return matchesSearch && matchesNeighborhood && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'listed': return 'bg-green-100 text-green-800 border-green-200'
      case 'unlisted': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handlePropertyAction = async (propertyId: string, action: string) => {
    try {
      const property = properties.find(p => p.id === propertyId)
      if (!property) return

      switch (action) {
        case 'view':
          setSelectedProperty(property)
          setIsViewDialogOpen(true)
          break
        case 'edit':
          setSelectedProperty(property)
          setIsEditDialogOpen(true)
          break
        case 'delete':
          // Implement delete logic
          console.log(`Delete property ${propertyId}`)
          break
        default:
          console.log(`${action} property ${propertyId}`)
      }
    } catch (error) {
      console.error(`Failed to ${action} property:`, error)
    }
  }

  const handleStatusClick = async (property: Property) => {
    const newStatus = property.listingStatus === 'listed' ? 'unlisted' : 'listed'
    
    try {
      // Update property status
      setProperties(prev => prev.map(p => 
        p.id === property.id 
          ? { ...p, listingStatus: newStatus as 'listed' | 'unlisted' }
          : p
      ))
      
      toast({
        title: 'Status Updated',
        description: `Property ${newStatus === 'listed' ? 'listed' : 'unlisted'} successfully!`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property status.',
        variant: 'destructive'
      })
    }
  }

  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties(prev => [...prev, propertyId])
    } else {
      setSelectedProperties(prev => prev.filter(id => id !== propertyId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(filteredProperties.map(p => p.id))
    } else {
      setSelectedProperties([])
    }
  }

  const handleBulkStatusUpdate = async (status: 'listed' | 'unlisted') => {
    try {
      setProperties(prev => prev.map(p => 
        selectedProperties.includes(p.id) 
          ? { ...p, listingStatus: status }
          : p
      ))
      
      toast({
        title: 'Bulk Update Complete',
        description: `${selectedProperties.length} properties ${status} successfully!`,
      })
      
      setSelectedProperties([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property statuses.',
        variant: 'destructive'
      })
    }
  }

  const handlePropertySave = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => 
      p.id === updatedProperty.id ? updatedProperty : p
    ))
    setIsEditDialogOpen(false)
    setSelectedProperty(null)
  }

  const handleRowClick = (property: Property) => {
    setSelectedProperty(property)
    setIsViewDialogOpen(true)
  }

  const addUnitDetail = () => {
    const newUnit: UnitDetail = {
      title: '',
      type: 'studio',
      rooms: 1,
      baths: 1,
      rent: 0,
      size: 0,
      count: 1,
      masterEnsuite: false,
      allEnsuite: false,
      features: {
        balcony: false,
        patio: false,
        sq: false,
        fittedKitchen: false,
        kitchen: 'open-plan',
        electricity: 'pre-paid',
        flooring: 'tiles',
        fireplace: false,
        solarWater: false,
        intercom: false,
        airCon: false,
        dobbyArea: false,
        pantry: false,
      }
    }
    setFormData(prev => ({
      ...prev,
      unitDetails: [...prev.unitDetails, newUnit]
    }))
  }

  const removeUnitDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      unitDetails: prev.unitDetails.filter((_, i) => i !== index)
    }))
  }

  const updateUnitDetail = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      unitDetails: prev.unitDetails.map((unit, i) => 
        i === index ? { ...unit, [field]: value } : unit
      )
    }))
  }

  const updateUnitFeature = (unitIndex: number, feature: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      unitDetails: prev.unitDetails.map((unit, i) => 
        i === unitIndex ? { 
          ...unit, 
          features: { ...unit.features, [feature]: value }
        } : unit
      )
    }))
  }

  const addContact = () => {
    const newContact: PropertyContact = {
      firstName: '',
      lastName: '',
      title: 'property manager',
      email: '',
      phone: '',
      propertyName: formData.name,
      notes: ''
    }
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }))
  }

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }))
  }

  const updateContact = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }))
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) errors.push('Property name is required')
    if (!formData.neighborhood.trim()) errors.push('Neighborhood is required')
    if (!formData.street.trim()) errors.push('Street address is required')
    if (!formData.year.trim()) errors.push('Year is required')
    if (!formData.units.trim()) errors.push('Number of units is required')
    if (!formData.floors.trim()) errors.push('Number of floors is required')
    
    // Check for duplicate property name (case-insensitive)
    const duplicateName = properties.some(p => 
      p.name.toLowerCase() === formData.name.toLowerCase().trim()
    )
    if (duplicateName) errors.push('A property with this name already exists')
    
    // Validate input format
    const nameRegex = /^[a-zA-Z0-9\s()]+$/
    if (formData.name && !nameRegex.test(formData.name)) {
      errors.push('Property name can only contain letters, numbers, spaces, and parentheses')
    }
    if (formData.neighborhood && !nameRegex.test(formData.neighborhood)) {
      errors.push('Neighborhood can only contain letters, numbers, spaces, and parentheses')
    }
    if (formData.street && !nameRegex.test(formData.street)) {
      errors.push('Street can only contain letters, numbers, spaces, and parentheses')
    }
    
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive'
      })
      return false
    }
    
    return true
  }

  const handleCreateProperty = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      // Here you would make an API call to create the property
      console.log('Creating property:', formData)
      
      toast({
        title: 'Success',
        description: 'Property created successfully!',
      })
      
      // Reset form and close dialog
      setFormData({
        name: '',
        neighborhood: '',
        street: '',
        year: '',
        units: '',
        floors: '',
        serviced: false,
        unitDetails: [],
        features: {
          pool: false,
          gym: false,
          sauna: false,
          steamRoom: false,
          restaurant: false,
          shop: false,
          cctv: false,
          borehole: false,
          backupGenerator: false,
          cinema: false,
          entertainmentRoom: false,
          conferenceRoom: false,
          disabilityAccess: false,
          garden: false,
          reservedParking: false,
          visitorParking: false,
          elevator: false,
          rooftopLounge: false,
          gazebo: false,
          indoorPlayground: false,
          outdoorPlayground: false,
          petFriendly: false,
          managerOnSite: false,
          patio: false,
          laundryMart: false,
          freeWater: false,
          freeWifi: false,
          mannedSecurity: false,
        },
        contacts: [],
        photos: [] as PropertyPhoto[],
        location: {} as PropertyLocation,
        notes: '',
      })
      setCurrentStep(1)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create property:', error)
      toast({
        title: 'Error',
        description: 'Failed to create property. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <Collapsible 
              open={expandedSections.basicInfo} 
              onOpenChange={() => toggleSection('basicInfo')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                {expandedSections.basicInfo ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Property Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.trim() }))}
                      placeholder="Enter property name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Neighborhood *</Label>
                    <div className="space-y-2">
                      <Select
                        value={formData.neighborhood}
                        onValueChange={(value) => {
                          if (value === 'add-new') {
                            setShowNewNeighborhood(true)
                          } else {
                            setFormData(prev => ({ ...prev, neighborhood: value }))
                            setShowNewNeighborhood(false)
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select neighborhood" />
                        </SelectTrigger>
                        <SelectContent>
                          {neighborhoods.map(neighborhood => (
                            <SelectItem key={neighborhood} value={neighborhood}>
                              {neighborhood}
                            </SelectItem>
                          ))}
                          <SelectItem value="add-new">+ Add New Neighborhood</SelectItem>
                        </SelectContent>
                      </Select>
                      {showNewNeighborhood && (
                        <div className="flex space-x-2">
                          <Input
                            value={newNeighborhood}
                            onChange={(e) => setNewNeighborhood(e.target.value)}
                            placeholder="Enter new neighborhood"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (newNeighborhood.trim()) {
                                setFormData(prev => ({ ...prev, neighborhood: newNeighborhood.trim() }))
                                setNewNeighborhood('')
                                setShowNewNeighborhood(false)
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value.trim() }))}
                    placeholder="Enter street address"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year">Year Built *</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <Label htmlFor="units">Number of Units *</Label>
                    <Input
                      id="units"
                      value={formData.units}
                      onChange={(e) => setFormData(prev => ({ ...prev, units: e.target.value }))}
                      placeholder="24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="floors">Number of Floors *</Label>
                    <Input
                      id="floors"
                      value={formData.floors}
                      onChange={(e) => setFormData(prev => ({ ...prev, floors: e.target.value }))}
                      placeholder="6"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="serviced"
                    checked={formData.serviced}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, serviced: checked }))}
                  />
                  <Label htmlFor="serviced">Serviced Property</Label>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the property..."
                    rows={3}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            {/* Property Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Features</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(formData.features).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          features: { ...prev.features, [key]: checked }
                        }))
                      }
                    />
                    <Label htmlFor={key} className="text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            {/* Unit Details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Unit Details</h3>
                <Button type="button" onClick={addUnitDetail} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit Type
                </Button>
              </div>
              
              {formData.unitDetails.map((unit, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Unit Type {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeUnitDetail(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Unit Title</Label>
                        <Input
                          value={unit.title}
                          onChange={(e) => updateUnitDetail(index, 'title', e.target.value)}
                          placeholder="e.g., Standard Studio"
                        />
                      </div>
                      <div>
                        <Label>Unit Type</Label>
                        <Select
                          value={unit.type}
                          onValueChange={(value) => updateUnitDetail(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="1 bedroom">1 Bedroom</SelectItem>
                            <SelectItem value="2 bedroom">2 Bedroom</SelectItem>
                            <SelectItem value="3 bedroom">3 Bedroom</SelectItem>
                            <SelectItem value="4 bedroom">4 Bedroom</SelectItem>
                            <SelectItem value="5+ bedroom">5+ Bedroom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label>Rooms</Label>
                        <Input
                          type="number"
                          value={unit.rooms}
                          onChange={(e) => updateUnitDetail(index, 'rooms', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label>Bathrooms</Label>
                        <Input
                          type="number"
                          value={unit.baths}
                          onChange={(e) => updateUnitDetail(index, 'baths', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label>Rent ($)</Label>
                        <Input
                          type="number"
                          value={unit.rent}
                          onChange={(e) => updateUnitDetail(index, 'rent', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label>Size (sq ft)</Label>
                        <Input
                          type="number"
                          value={unit.size}
                          onChange={(e) => updateUnitDetail(index, 'size', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Count</Label>
                        <Input
                          type="number"
                          value={unit.count}
                          onChange={(e) => updateUnitDetail(index, 'count', parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`masterEnsuite-${index}`}
                          checked={unit.masterEnsuite}
                          onCheckedChange={(checked) => updateUnitDetail(index, 'masterEnsuite', checked)}
                        />
                        <Label htmlFor={`masterEnsuite-${index}`}>Master Ensuite</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`allEnsuite-${index}`}
                          checked={unit.allEnsuite}
                          onCheckedChange={(checked) => updateUnitDetail(index, 'allEnsuite', checked)}
                        />
                        <Label htmlFor={`allEnsuite-${index}`}>All Ensuite</Label>
                      </div>
                    </div>
                    
                    {/* Unit Features */}
                    <div>
                      <Label className="text-sm font-medium">Unit Features</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {Object.entries(unit.features).map(([key, value]) => {
                          if (key === 'kitchen' || key === 'electricity' || key === 'flooring') {
                            return (
                              <div key={key}>
                                <Label className="text-xs">{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                                <Select
                                  value={value as string}
                                  onValueChange={(val) => updateUnitFeature(index, key, val)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {key === 'kitchen' && (
                                      <>
                                        <SelectItem value="open-plan">Open Plan</SelectItem>
                                        <SelectItem value="closed-plan">Closed Plan</SelectItem>
                                      </>
                                    )}
                                    {key === 'electricity' && (
                                      <>
                                        <SelectItem value="pre-paid">Pre-paid</SelectItem>
                                        <SelectItem value="post-paid">Post-paid</SelectItem>
                                      </>
                                    )}
                                    {key === 'flooring' && (
                                      <>
                                        <SelectItem value="wooden">Wooden</SelectItem>
                                        <SelectItem value="tiles">Tiles</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            )
                          }
                          
                          return (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${key}-${index}`}
                                checked={value as boolean}
                                onCheckedChange={(checked) => updateUnitFeature(index, key, checked)}
                              />
                              <Label htmlFor={`${key}-${index}`} className="text-xs">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            {/* Contacts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <Button type="button" onClick={addContact} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
              
              {formData.contacts.map((contact, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Contact {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeContact(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={contact.firstName}
                          onChange={(e) => updateContact(index, 'firstName', e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={contact.lastName}
                          onChange={(e) => updateContact(index, 'lastName', e.target.value)}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Title</Label>
                      <Select
                        value={contact.title}
                        onValueChange={(value) => updateContact(index, 'title', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="tenant">Tenant</SelectItem>
                          <SelectItem value="caretaker">Caretaker</SelectItem>
                          <SelectItem value="watchman">Watchman</SelectItem>
                          <SelectItem value="property manager">Property Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateContact(index, 'email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={contact.phone}
                          onChange={(e) => updateContact(index, 'phone', e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={contact.notes}
                        onChange={(e) => updateContact(index, 'notes', e.target.value)}
                        placeholder="Additional notes about this contact..."
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      
      case 5:
        return (
          <div className="space-y-6">
            {/* Photos Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Photos</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Drag and drop photos here, or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, WebP (Max 10MB each)
                </p>
                <Button variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </div>
            
            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="space-y-4">
                <div>
                  <Label>Search Location</Label>
                  <Input
                    placeholder="Search for address or place..."
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500">
                    Use Google Maps Autocomplete to select location and auto-populate fields
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.location.lat || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, lat: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="37.7749"
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.location.lng || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, lng: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="-122.4194"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Formatted Address</Label>
                  <Input
                    value={formData.location.formattedAddress || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, formattedAddress: e.target.value }
                    }))}
                    placeholder="123 Main Street, San Francisco, CA 94102"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={formData.location.city || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, city: e.target.value }
                      }))}
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input
                      value={formData.location.country_long || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, country_long: e.target.value }
                      }))}
                      placeholder="United States"
                    />
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input
                      value={formData.location.zipcode || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, zipcode: e.target.value }
                      }))}
                      placeholder="94102"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 6:
        return (
          <div className="space-y-6">
            {/* Review */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Review Property Details</h3>
              
              <div className="space-y-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {formData.name}</div>
                    <div><strong>Neighborhood:</strong> {formData.neighborhood}</div>
                    <div><strong>Street:</strong> {formData.street}</div>
                    <div><strong>Year:</strong> {formData.year}</div>
                    <div><strong>Units:</strong> {formData.units}</div>
                    <div><strong>Floors:</strong> {formData.floors}</div>
                    <div><strong>Serviced:</strong> {formData.serviced ? 'Yes' : 'No'}</div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.features)
                      .filter(([_, value]) => value)
                      .map(([key, _]) => (
                        <Badge key={key} variant="secondary">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Badge>
                      ))}
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Unit Details ({formData.unitDetails.length})</h4>
                  {formData.unitDetails.map((unit, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                      <div className="text-sm">
                        <strong>{unit.title}</strong> - {unit.type} | {unit.count} units | ${unit.rent}/month
                      </div>
                    </div>
                  ))}
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Contacts ({formData.contacts.length})</h4>
                  {formData.contacts.map((contact, index) => (
                    <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                      <div className="text-sm">
                        <strong>{contact.firstName} {contact.lastName}</strong> - {contact.title}
                        <br />
                        {contact.email} | {contact.phone}
                      </div>
                    </div>
                  ))}
                </Card>
                
                {formData.notes && (
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm">{formData.notes}</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-2">Manage properties, units, and listings</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Property</DialogTitle>
              <DialogDescription>
                Step {currentStep} of 6: Complete all sections to create a new property listing.
              </DialogDescription>
            </DialogHeader>
            
            {/* Step Navigation */}
            <div className="flex items-center justify-between py-4 border-b">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === currentStep
                        ? 'bg-blue-600 text-white'
                        : step < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {['Basic Info', 'Features', 'Units', 'Contacts', 'Photos & Location', 'Review'][currentStep - 1]}
              </div>
            </div>
            
            <div className="py-4">
              {renderStepContent()}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1)
                  } else {
                    setIsCreateDialogOpen(false)
                  }
                }}
              >
                {currentStep > 1 ? 'Previous' : 'Cancel'}
              </Button>
              
              <div className="space-x-2">
                {currentStep < 6 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateProperty}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Property'}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties by name, address, or neighborhood..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Neighborhoods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Neighborhoods</SelectItem>
                {neighborhoods.map(neighborhood => (
                  <SelectItem key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="listed">Listed</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <Card className="mb-4 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedProperties.length} properties selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusUpdate('listed')}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    List Selected
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusUpdate('unlisted')}
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                  >
                    Unlist Selected
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedProperties([])}
                className="text-blue-700 hover:text-blue-800"
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Properties Table */}
      <Card className="border-0 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Neighbourhood</TableHead>
              <TableHead>Unit Types</TableHead>
              <TableHead>Listing Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow 
                key={property.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={(e) => {
                  // Don't trigger row click if clicking on checkbox, badge, or actions
                  if (
                    (e.target as HTMLElement).closest('input[type="checkbox"]') ||
                    (e.target as HTMLElement).closest('[data-status-badge]') ||
                    (e.target as HTMLElement).closest('[data-dropdown-trigger]')
                  ) {
                    return
                  }
                  handleRowClick(property)
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) => handleSelectProperty(property.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{property.name}</div>
                    <div className="text-sm text-gray-500">{property.street}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {property.neighborhood}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {property.unitDetails.map(unit => unit.type).join(', ')}
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusBadgeColor(property.listingStatus)} cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => handleStatusClick(property)}
                    data-status-badge
                  >
                    {property.listingStatus.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">{property.createdBy}</div>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" data-dropdown-trigger>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePropertyAction(property.id, 'view')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePropertyAction(property.id, 'edit')}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Property
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handlePropertyAction(property.id, 'delete')}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Property
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new property.</p>
        </div>
      )}

      {/* Property View Dialog */}
      <PropertyViewDialog
        property={selectedProperty}
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false)
          setSelectedProperty(null)
        }}
        onEdit={() => {
          setIsViewDialogOpen(false)
          setIsEditDialogOpen(true)
        }}
      />

      {/* Property Edit Dialog */}
      <PropertyEditDialog
        property={selectedProperty}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedProperty(null)
        }}
        onSave={handlePropertySave}
      />
    </div>
  )
}

export default Properties