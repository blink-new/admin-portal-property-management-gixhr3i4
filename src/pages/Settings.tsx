import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database, 
  Key, 
  Globe,
  Save,
  AlertTriangle
} from 'lucide-react'
import { useToast } from '../hooks/use-toast'

const Settings: React.FC = () => {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // System Settings
    systemName: 'Admin Portal',
    systemDescription: 'Property Management Admin Portal',
    maintenanceMode: false,
    
    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowPasswordReset: true,
    
    // Notification Settings
    emailNotifications: true,
    systemAlerts: true,
    userRegistrationNotify: true,
    propertyUpdateNotify: false,
    
    // API Settings
    apiRateLimit: 1000,
    apiKeyRotationDays: 90,
    enableApiLogging: true,
    
    // Database Settings
    backupFrequency: 'daily',
    retentionDays: 30,
    enableAuditLog: true
  })

  const handleSaveSettings = async () => {
    try {
      // Implement settings save logic here
      console.log('Saving settings:', settings)
      toast({
        title: "Settings saved",
        description: "System settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResetSettings = () => {
    // Reset to default values
    setSettings({
      systemName: 'Admin Portal',
      systemDescription: 'Property Management Admin Portal',
      maintenanceMode: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowPasswordReset: true,
      emailNotifications: true,
      systemAlerts: true,
      userRegistrationNotify: true,
      propertyUpdateNotify: false,
      apiRateLimit: 1000,
      apiKeyRotationDays: 90,
      enableApiLogging: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      enableAuditLog: true
    })
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    })
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">System Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemDescription">System Description</Label>
              <Input
                id="systemDescription"
                value={settings.systemDescription}
                onChange={(e) => setSettings({ ...settings, systemDescription: e.target.value })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Temporarily disable user access</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
                {settings.maintenanceMode && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">Security Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">Enforce 2FA for all users</p>
              </div>
              <Switch
                checked={settings.requireTwoFactor}
                onCheckedChange={(checked) => setSettings({ ...settings, requireTwoFactor: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Password Reset</Label>
                <p className="text-sm text-gray-600">Enable forgot password functionality</p>
              </div>
              <Switch
                checked={settings.allowPasswordReset}
                onCheckedChange={(checked) => setSettings({ ...settings, allowPasswordReset: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">Notification Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-600">Send system notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Alerts</Label>
                <p className="text-sm text-gray-600">Critical system alerts and warnings</p>
              </div>
              <Switch
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, systemAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration Notifications</Label>
                <p className="text-sm text-gray-600">Notify when new users register</p>
              </div>
              <Switch
                checked={settings.userRegistrationNotify}
                onCheckedChange={(checked) => setSettings({ ...settings, userRegistrationNotify: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Property Update Notifications</Label>
                <p className="text-sm text-gray-600">Notify on property changes</p>
              </div>
              <Switch
                checked={settings.propertyUpdateNotify}
                onCheckedChange={(checked) => setSettings({ ...settings, propertyUpdateNotify: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">API Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
              <Input
                id="apiRateLimit"
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => setSettings({ ...settings, apiRateLimit: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKeyRotation">API Key Rotation (days)</Label>
              <Input
                id="apiKeyRotation"
                type="number"
                value={settings.apiKeyRotationDays}
                onChange={(e) => setSettings({ ...settings, apiKeyRotationDays: parseInt(e.target.value) })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable API Logging</Label>
                <p className="text-sm text-gray-600">Log all API requests and responses</p>
              </div>
              <Switch
                checked={settings.enableApiLogging}
                onCheckedChange={(checked) => setSettings({ ...settings, enableApiLogging: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">Database Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <select
                  id="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retentionDays">Backup Retention (days)</Label>
                <Input
                  id="retentionDays"
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Audit Log</Label>
                  <p className="text-sm text-gray-600">Track all database changes</p>
                </div>
                <Switch
                  checked={settings.enableAuditLog}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableAuditLog: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-6 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">456</div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2.1GB</div>
              <div className="text-sm text-gray-600">Database Size</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings