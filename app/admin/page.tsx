'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { NavigationItem } from "@/lib/navigation"
import { LogOut, Key, Save, Lock, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function AdminDashboard() {
  const router = useRouter()
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        // Check for admin info in localStorage
        const adminInfo = localStorage.getItem("adminInfo")
        if (!adminInfo) {
          router.push("/admin/login")
          return
        }

        const response = await fetch("/api/admin/navigation", {
          cache: 'no-store', // Disable caching
          headers: {
            'Cache-Control': 'no-cache' // Additional cache control
          }
        })
        if (!response.ok) {
          throw new Error("Failed to fetch navigation items")
        }
        const data = await response.json()
        // The API returns { items: NavigationItem[] }
        setNavigationItems(data.items || [])
      } catch (err) {
        console.error("Error fetching navigation items:", err)
        setError("Failed to load navigation items")
        setNavigationItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNavigationItems()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      })
      localStorage.removeItem('adminInfo')
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match")
      return
    }

    setIsChangingPassword(true)
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}")
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: adminInfo.id,
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      // Clear form and close modal
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordModal(false)
      
      // Show success message (you can use your toast notification system here)
      setSuccess('Password changed successfully')
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSaveNavigation = async () => {
    try {
      setError('')
      setIsSaving(true)
      const res = await fetch('/api/admin/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(navigationItems),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save navigation items')
      }
      
      setSuccess('Navigation items saved successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save navigation items')
    } finally {
      setIsSaving(false)
    }
  }

  const updateNavigationItem = (id: string, updates: Partial<NavigationItem>) => {
    // If updating href, ensure it has proper protocol for external links
    if (updates.href) {
      const href = updates.href.trim()
      // If it's an external link (starts with www. or contains a dot and no slash)
      if (href.startsWith('www.') || (href.includes('.') && !href.includes('/'))) {
        updates.href = `https://${href}`
      }
    }
    
    setNavigationItems(items =>
      items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new one
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isChangingPassword}>
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Management</CardTitle>
            <CardDescription>
              Manage your website navigation items. Toggle visibility and update labels and links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              {navigationItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.label}
                      onChange={(e) => updateNavigationItem(item.id, { label: e.target.value })}
                      placeholder="Label"
                    />
                    <div className="space-y-1">
                      <Input
                        value={item.href}
                        onChange={(e) => updateNavigationItem(item.id, { href: e.target.value })}
                        placeholder="Link (e.g., /about or https://example.com)"
                      />
                      <p className="text-xs text-gray-500">
                        For internal links, use paths like /about. For external links, use full URLs like https://example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Active</label>
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={(checked) =>
                        updateNavigationItem(item.id, { isActive: checked })
                      }
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveNavigation} className="w-full" disabled={isSaving}>
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 