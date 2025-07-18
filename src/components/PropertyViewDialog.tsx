import React from 'react'
import { Edit, ExternalLink, MapPin, Building2, Users, Star, Calendar, User } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Property } from '../types'

interface PropertyViewDialogProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

const PropertyViewDialog: React.FC<PropertyViewDialogProps> = ({
  property,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!property) return null

  const previewListing = () => {
    // Open property listing in new tab
    window.open(`https://listings.example.com/property/${property.id}`, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'listed': return 'bg-green-100 text-green-800 border-green-200'
      case 'unlisted': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{property.name}</DialogTitle>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.street}, {property.neighborhood}</span>
                </div>
                <Badge variant="outline" className={getStatusColor(property.listingStatus)}>
                  {property.listingStatus.toUpperCase()}
                </Badge>
              </div>
            </div>
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
                onClick={onEdit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Property
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-6 flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="units">Units ({property.unitDetails.length})</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="contacts">Contacts ({property.contacts.length})</TabsTrigger>
              <TabsTrigger value="photos">Photos ({property.photos.length})</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Property Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{property.units}</div>
                      <div className="text-sm text-gray-600">Total Units</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Building2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{property.floors}</div>
                      <div className="text-sm text-gray-600">Floors</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{property.year}</div>
                      <div className="text-sm text-gray-600">Year Built</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{property.contacts.length}</div>
                      <div className="text-sm text-gray-600">Contacts</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Property Name</label>
                          <p className="text-lg font-semibold">{property.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Neighborhood</label>
                          <p>{property.neighborhood}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Street Address</label>
                          <p>{property.street}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Serviced Property</label>
                          <Badge variant={property.serviced ? "default" : "secondary"}>
                            {property.serviced ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created Date</label>
                          <p>{formatDate(property.createdAt)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Last Updated</label>
                          <p>{formatDate(property.updatedAt)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created By</label>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{property.createdBy}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Listing Status</label>
                          <Badge variant="outline" className={getStatusColor(property.listingStatus)}>
                            {property.listingStatus.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {property.notes && (
                      <div className="mt-6">
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{property.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="units" className="space-y-6 mt-0">
                {property.unitDetails.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No unit details available</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {property.unitDetails.map((unit, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{unit.title || `Unit Type ${index + 1}`}</CardTitle>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {unit.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-xl font-bold text-blue-600">{unit.rooms}</div>
                              <div className="text-sm text-gray-600">Rooms</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-xl font-bold text-green-600">{unit.baths}</div>
                              <div className="text-sm text-gray-600">Bathrooms</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-xl font-bold text-purple-600">{formatCurrency(unit.rent)}</div>
                              <div className="text-sm text-gray-600">Monthly Rent</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-xl font-bold text-orange-600">{unit.size}</div>
                              <div className="text-sm text-gray-600">Sq Ft</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Available Units</label>
                              <p className="text-lg font-semibold">{unit.count}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Master Ensuite</label>
                              <Badge variant={unit.masterEnsuite ? "default" : "secondary"}>
                                {unit.masterEnsuite ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">All Ensuite</label>
                              <Badge variant={unit.allEnsuite ? "default" : "secondary"}>
                                {unit.allEnsuite ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-2 block">Unit Features</label>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(unit.features)
                                .filter(([_, value]) => {
                                  if (typeof value === 'boolean') return value
                                  if (typeof value === 'string') return value !== ''
                                  return false
                                })
                                .map(([key, value]) => (
                                  <Badge key={key} variant="secondary" className="text-xs">
                                    {typeof value === 'string' 
                                      ? `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`
                                      : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                                    }
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="features" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(property.features).filter(([_, value]) => value).length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No features selected</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(property.features)
                          .filter(([_, value]) => value)
                          .map(([key, _]) => (
                            <div key={key} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-green-800">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacts" className="space-y-6 mt-0">
                {property.contacts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No contacts available</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {property.contacts.map((contact, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {contact.firstName} {contact.lastName}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {contact.title}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Email</label>
                                  <p className="text-sm">{contact.email || 'Not provided'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Phone</label>
                                  <p className="text-sm">{contact.phone || 'Not provided'}</p>
                                </div>
                              </div>
                              
                              {contact.notes && (
                                <div className="mt-3">
                                  <label className="text-sm font-medium text-gray-500">Notes</label>
                                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
                                    {contact.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="photos" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Photos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {property.photos.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No photos available</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {property.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="w-full h-48 object-cover rounded-lg shadow-sm"
                            />
                            {photo.isPrimary && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-yellow-500 text-white">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Primary
                                </Badge>
                              </div>
                            )}
                            {photo.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                                <p className="text-sm truncate">{photo.caption}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Location Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {property.location ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Formatted Address</label>
                            <p className="text-sm">{property.location.formattedAddress || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">City</label>
                            <p className="text-sm">{property.location.city || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Country</label>
                            <p className="text-sm">{property.location.country_long || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                            <p className="text-sm">{property.location.zipcode || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Latitude</label>
                            <p className="text-sm">{property.location.lat || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Longitude</label>
                            <p className="text-sm">{property.location.lng || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        {property.location.description && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                              {property.location.description}
                            </p>
                          </div>
                        )}
                        
                        {property.location.lat && property.location.lng && (
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const url = `https://www.google.com/maps?q=${property.location.lat},${property.location.lng}`
                                window.open(url, '_blank')
                              }}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              View on Google Maps
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No location information available</p>
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

export default PropertyViewDialog