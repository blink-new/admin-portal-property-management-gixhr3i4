import React, { useState, useEffect } from 'react'
import { X, Plus, Star, Upload, ExternalLink, Save } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Property, PropertyContact, UnitDetail, PropertyPhoto } from '../types'
import { useToast } from '../hooks/use-toast'

interface PropertyEditDialogProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onSave: (property: Property) => void
}

const PropertyEditDialog: React.FC<PropertyEditDialogProps> = ({
  property,
  isOpen,
  onClose,
  onSave
}) => {
  const { toast } = useToast()
  const [editedProperty, setEditedProperty] = useState<Property | null>(null)
  const [activeTab, setActiveTab] = useState('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize edited property when dialog opens
  useEffect(() => {
    if (property && isOpen) {
      setEditedProperty({ ...property })
      setActiveTab('basic')
    }
  }, [property, isOpen])

  if (!editedProperty) return null

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      // Validate required fields
      if (!editedProperty.name.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Property name is required',
          variant: 'destructive'
        })
        return
      }

      onSave(editedProperty)
      toast({
        title: 'Success',
        description: 'Property updated successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateBasicInfo = (field: string, value: any) => {
    setEditedProperty(prev => prev ? { ...prev, [field]: value } : null)
  }

  const updateFeature = (feature: string, value: boolean) => {
    setEditedProperty(prev => prev ? {
      ...prev,
      features: { ...prev.features, [feature]: value }
    } : null)
  }

  const addUnit = () => {
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
    setEditedProperty(prev => prev ? {
      ...prev,
      unitDetails: [...prev.unitDetails, newUnit]
    } : null)
  }

  const removeUnit = (index: number) => {
    setEditedProperty(prev => prev ? {
      ...prev,
      unitDetails: prev.unitDetails.filter((_, i) => i !== index)
    } : null)
  }

  const updateUnit = (index: number, field: string, value: any) => {
    setEditedProperty(prev => prev ? {
      ...prev,
      unitDetails: prev.unitDetails.map((unit, i) => 
        i === index ? { ...unit, [field]: value } : unit
      )
    } : null)
  }

  const updateUnitFeature = (unitIndex: number, feature: string, value: any) => {
    setEditedProperty(prev => prev ? {
      ...prev,
      unitDetails: prev.unitDetails.map((unit, i) => 
        i === unitIndex ? { 
          ...unit, 
          features: { ...unit.features, [feature]: value }
        } : unit
      )
    } : null)
  }

  const addContact = () => {
    const newContact: PropertyContact = {
      firstName: '',
      lastName: '',
      title: 'property manager',
      email: '',
      phone: '',
      propertyName: editedProperty.name,
      notes: ''
    }
    setEditedProperty(prev => prev ? {
      ...prev,
      contacts: [...prev.contacts, newContact]
    } : null)
  }

  const removeContact = (index: number) => {
    setEditedProperty(prev => prev ? {
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    } : null)
  }

  const updateContact = (index: number, field: string, value: any) => {
    setEditedProperty(prev => prev ? {
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    } : null)
  }

  const addPhoto = () => {
    // Mock photo for demo - in real app, this would handle file upload
    const newPhoto: PropertyPhoto = {
      id: `photo-${Date.now()}`,
      url: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop`,
      caption: 'New photo',
      isPrimary: editedProperty.photos.length === 0
    }
    setEditedProperty(prev => prev ? {
      ...prev,
      photos: [...prev.photos, newPhoto]
    } : null)
  }

  const removePhoto = (photoId: string) => {
    setEditedProperty(prev => prev ? {
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    } : null)
  }

  const setPrimaryPhoto = (photoId: string) => {
    setEditedProperty(prev => prev ? {
      ...prev,
      photos: prev.photos.map(photo => ({
        ...photo,
        isPrimary: photo.id === photoId
      }))
    } : null)
  }

  const previewListing = () => {
    // Open property listing in new tab
    window.open(`https://listings.example.com/property/${editedProperty.id}`, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Edit Property: {editedProperty.name}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previewListing}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Listing
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 flex-shrink-0">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="units">Units</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="basic" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Property Name *</Label>
                        <Input
                          id="name"
                          value={editedProperty.name}
                          onChange={(e) => updateBasicInfo('name', e.target.value)}
                          placeholder="Enter property name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="neighborhood">Neighborhood *</Label>
                        <Input
                          id="neighborhood"
                          value={editedProperty.neighborhood}
                          onChange={(e) => updateBasicInfo('neighborhood', e.target.value)}
                          placeholder="Enter neighborhood"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={editedProperty.street}
                        onChange={(e) => updateBasicInfo('street', e.target.value)}
                        placeholder="Enter street address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="year">Year Built</Label>
                        <Input
                          id="year"
                          value={editedProperty.year}
                          onChange={(e) => updateBasicInfo('year', e.target.value)}
                          placeholder="2020"
                        />
                      </div>
                      <div>
                        <Label htmlFor="units">Number of Units</Label>
                        <Input
                          id="units"
                          value={editedProperty.units}
                          onChange={(e) => updateBasicInfo('units', e.target.value)}
                          placeholder="24"
                        />
                      </div>
                      <div>
                        <Label htmlFor="floors">Number of Floors</Label>
                        <Input
                          id="floors"
                          value={editedProperty.floors}
                          onChange={(e) => updateBasicInfo('floors', e.target.value)}
                          placeholder="6"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="serviced"
                        checked={editedProperty.serviced}
                        onCheckedChange={(checked) => updateBasicInfo('serviced', checked)}
                      />
                      <Label htmlFor="serviced">Serviced Property</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={editedProperty.notes}
                        onChange={(e) => updateBasicInfo('notes', e.target.value)}
                        placeholder="Additional notes about the property..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(editedProperty.features).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) => updateFeature(key, checked as boolean)}
                          />
                          <Label htmlFor={key} className="text-sm">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="units" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Unit Details</CardTitle>
                      <Button onClick={addUnit} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Unit Type
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editedProperty.unitDetails.map((unit, index) => (
                      <Card key={index} className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Unit Type {index + 1}</h4>
                          <Button
                            onClick={() => removeUnit(index)}
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
                                onChange={(e) => updateUnit(index, 'title', e.target.value)}
                                placeholder="e.g., Standard Studio"
                              />
                            </div>
                            <div>
                              <Label>Unit Type</Label>
                              <Select
                                value={unit.type}
                                onValueChange={(value) => updateUnit(index, 'type', value)}
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
                                onChange={(e) => updateUnit(index, 'rooms', parseInt(e.target.value) || 0)}
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Bathrooms</Label>
                              <Input
                                type="number"
                                value={unit.baths}
                                onChange={(e) => updateUnit(index, 'baths', parseInt(e.target.value) || 0)}
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Rent ($)</Label>
                              <Input
                                type="number"
                                value={unit.rent}
                                onChange={(e) => updateUnit(index, 'rent', parseInt(e.target.value) || 0)}
                                min="0"
                              />
                            </div>
                            <div>
                              <Label>Size (sq ft)</Label>
                              <Input
                                type="number"
                                value={unit.size}
                                onChange={(e) => updateUnit(index, 'size', parseInt(e.target.value) || 0)}
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
                                onChange={(e) => updateUnit(index, 'count', parseInt(e.target.value) || 1)}
                                min="1"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`masterEnsuite-${index}`}
                                checked={unit.masterEnsuite}
                                onCheckedChange={(checked) => updateUnit(index, 'masterEnsuite', checked)}
                              />
                              <Label htmlFor={`masterEnsuite-${index}`}>Master Ensuite</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`allEnsuite-${index}`}
                                checked={unit.allEnsuite}
                                onCheckedChange={(checked) => updateUnit(index, 'allEnsuite', checked)}
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
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacts" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Contact Information</CardTitle>
                      <Button onClick={addContact} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editedProperty.contacts.map((contact, index) => (
                      <Card key={index} className="p-4 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Contact {index + 1}</h4>
                          <Button
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
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Property Photos</CardTitle>
                      <Button onClick={addPhoto} variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Add Photo
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editedProperty.photos.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No photos uploaded yet</p>
                        <p className="text-sm">Click "Add Photo" to upload images</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {editedProperty.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setPrimaryPhoto(photo.id)}
                                  className={photo.isPrimary ? 'bg-yellow-500 text-white' : ''}
                                >
                                  <Star className={`h-4 w-4 ${photo.isPrimary ? 'fill-current' : ''}`} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removePhoto(photo.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {photo.isPrimary && (
                              <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PropertyEditDialog