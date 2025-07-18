import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  UserPlus,
  Activity,
  Filter,
  Calendar,
  Mail,
  Shield,
  AlertTriangle,
  Eye,
  Settings
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { User, AuditLogEntry } from '../types'
import { blink } from '../blink/client'
import { useAuth } from '../contexts/AuthContext'

const TeamManagement: React.FC = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form states
  const [inviteForm, setInviteForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'surveyor' as User['role']
  })

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'surveyor' as User['role'],
    status: 'active' as User['status']
  })

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      
      // Fetch team members
      const teamMembers = await blink.db.adminUsers.list({
        orderBy: { createdAt: 'desc' }
      })
      
      // Transform snake_case to camelCase
      const transformedUsers: User[] = teamMembers.map(member => ({
        id: member.id,
        email: member.email,
        firstName: member.firstName || member.first_name,
        lastName: member.lastName || member.last_name,
        role: member.role as User['role'],
        status: member.status as User['status'],
        emailVerified: Number(member.emailVerified || member.email_verified) > 0,
        createdAt: member.createdAt || member.created_at,
        updatedAt: member.updatedAt || member.updated_at,
        lastLogin: member.lastLogin || member.last_login
      }))
      
      setUsers(transformedUsers)

      // Fetch audit logs
      const logs = await blink.db.auditLog.list({
        orderBy: { createdAt: 'desc' },
        limit: 100
      })
      
      // Transform audit logs
      const transformedLogs: AuditLogEntry[] = logs.map(log => ({
        id: log.id,
        userId: log.userId || log.user_id,
        action: log.action,
        resourceType: log.resourceType || log.resource_type,
        resourceId: log.resourceId || log.resource_id,
        details: log.details,
        ipAddress: log.ipAddress || log.ip_address,
        userAgent: log.userAgent || log.user_agent,
        createdAt: log.createdAt || log.created_at
      }))
      
      setAuditLogs(transformedLogs)
    } catch (error) {
      console.error('Failed to fetch team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-100 text-red-800 border-red-200'
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'surveyor': return 'bg-green-100 text-green-800 border-green-200'
      case 'property_manager': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'banned': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return 'bg-green-100 text-green-800'
      case 'update': return 'bg-blue-100 text-blue-800'
      case 'delete': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleInviteUser = async () => {
    try {
      const newUser = {
        id: `admin_${Date.now()}`,
        userId: `user_admin_${Date.now()}`,
        email: inviteForm.email,
        firstName: inviteForm.firstName,
        lastName: inviteForm.lastName,
        role: inviteForm.role,
        status: 'active' as const,
        emailVerified: false
      }

      await blink.db.adminUsers.create(newUser)
      
      // Log the invitation
      await blink.db.auditLog.create({
        id: `audit_${Date.now()}`,
        userId: currentUser?.id || 'system',
        action: 'INVITE',
        resourceType: 'user',
        resourceId: newUser.id,
        details: `Invited new team member: ${inviteForm.firstName} ${inviteForm.lastName} (${inviteForm.email})`
      })

      setInviteForm({ email: '', firstName: '', lastName: '', role: 'surveyor' })
      setIsInviteDialogOpen(false)
      fetchTeamData()
    } catch (error) {
      console.error('Failed to invite user:', error)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    try {
      await blink.db.adminUsers.update(selectedUser.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        role: editForm.role,
        status: editForm.status
      })

      // Log the update
      await blink.db.auditLog.create({
        id: `audit_${Date.now()}`,
        userId: currentUser?.id || 'system',
        action: 'UPDATE',
        resourceType: 'user',
        resourceId: selectedUser.id,
        details: `Updated user details for ${editForm.firstName} ${editForm.lastName}`
      })

      setIsEditDialogOpen(false)
      setSelectedUser(null)
      fetchTeamData()
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      let updateData: Partial<User> = {}
      let logDetails = ''

      switch (action) {
        case 'ban':
          updateData = { status: 'banned' }
          logDetails = `Banned user: ${user.firstName} ${user.lastName}`
          break
        case 'activate':
          updateData = { status: 'active' }
          logDetails = `Activated user: ${user.firstName} ${user.lastName}`
          break
        case 'deactivate':
          updateData = { status: 'inactive' }
          logDetails = `Deactivated user: ${user.firstName} ${user.lastName}`
          break
      }

      if (Object.keys(updateData).length > 0) {
        await blink.db.adminUsers.update(userId, updateData)
        
        // Log the action
        await blink.db.auditLog.create({
          id: `audit_${Date.now()}`,
          userId: currentUser?.id || 'system',
          action: action.toUpperCase(),
          resourceType: 'user',
          resourceId: userId,
          details: logDetails
        })

        fetchTeamData()
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      await blink.db.adminUsers.delete(userId)
      
      // Log the deletion
      await blink.db.auditLog.create({
        id: `audit_${Date.now()}`,
        userId: currentUser?.id || 'system',
        action: 'DELETE',
        resourceType: 'user',
        resourceId: userId,
        details: `Deleted user: ${user.firstName} ${user.lastName}`
      })

      fetchTeamData()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const getUserAuditLogs = (userId: string) => {
    return auditLogs.filter(log => log.userId === userId)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage team members, roles, and monitor activity</p>
        </div>
        <Button 
          onClick={() => setIsInviteDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Team Member
        </Button>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {/* Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search team members by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="surveyor">Surveyor</SelectItem>
                    <SelectItem value="property_manager">Property Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Team Members ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.emailVerified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getRoleBadgeColor(user.role)}`}
                            >
                              {user.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusBadgeColor(user.status)}`}
                            >
                              {user.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right text-sm text-gray-500 hidden md:block">
                          <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                          {user.lastLogin && (
                            <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => openViewDialog(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'active' ? (
                              <>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'deactivate')}>
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, 'ban')}>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ban User
                                </DropdownMenuItem>
                              </>
                            ) : user.status === 'inactive' ? (
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Unban User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.firstName} {user.lastName}? 
                                    This action cannot be undone and will remove all their data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Activity Log */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Team Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {auditLogs.map((log) => {
                  const user = users.find(u => u.id === log.userId || u.userId === log.userId)
                  return (
                    <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10 mt-1">
                          <AvatarImage src={user ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}` : undefined} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                            {user ? `${user.firstName[0]}${user.lastName[0]}` : 'SY'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getActionBadgeColor(log.action)}`}
                            >
                              {log.action}
                            </Badge>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              {log.resourceType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 mb-1">
                            {log.details || `${log.action} ${log.resourceType}`}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                            {user && (
                              <span>by {user.firstName} {user.lastName}</span>
                            )}
                            {log.ipAddress && (
                              <span>from {log.ipAddress}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join your team. They will receive an email with setup instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={inviteForm.firstName}
                  onChange={(e) => setInviteForm({...inviteForm, firstName: e.target.value})}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={inviteForm.lastName}
                  onChange={(e) => setInviteForm({...inviteForm, lastName: e.target.value})}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                placeholder="john.doe@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteForm.role} onValueChange={(value) => setInviteForm({...inviteForm, role: value as User['role']})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surveyor">Surveyor</SelectItem>
                  <SelectItem value="property_manager">Property Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteUser} className="bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Team Member
            </DialogTitle>
            <DialogDescription>
              Update team member information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email Address</Label>
              <Input
                id="editEmail"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value as User['role']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surveyor">Surveyor</SelectItem>
                    <SelectItem value="property_manager">Property Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value as User['status']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Team Member Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.firstName} ${selectedUser.lastName}`} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-medium">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getRoleBadgeColor(selectedUser.role)}>
                      {selectedUser.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getStatusBadgeColor(selectedUser.status)}>
                      {selectedUser.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Email Verified</p>
                  <p className="text-gray-600">{selectedUser.emailVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Member Since</p>
                  <p className="text-gray-600">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Last Updated</p>
                  <p className="text-gray-600">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Last Login</p>
                  <p className="text-gray-600">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getUserAuditLogs(selectedUser.id).slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center space-x-2 text-sm p-2 bg-gray-50 rounded">
                      <Badge className={`text-xs ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </Badge>
                      <span className="text-gray-600">{log.details}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {getUserAuditLogs(selectedUser.id).length === 0 && (
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TeamManagement