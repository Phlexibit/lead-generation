// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import DashboardLayout from "@/components/dashboard-layout"
// import { LoadingScreen, TeamSkeleton } from "@/components/loading-screen"
// import TeamMemberForm from "@/components/team-member-form"
// import TeamMemberEditForm from "@/components/team-member-edit-form"
// import LeadsList from "@/components/leads-list"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Pen, Plus, Upload } from "lucide-react"
// import { useAuthStore } from "@/stores/auth-store"
// import { useLeadList } from "@/hooks/use-leads"
// import LeadForm, { Lead } from "@/components/lead-form"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Textarea } from "@/components/ui/textarea"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { CalendarIcon } from "lucide-react"
// import { format } from "date-fns"
// import { cn } from "@/lib/utils"


// interface AddTeamMember {
//   username: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   number: string;
//   roles: string[];
//   password: string;
// }


// export interface Lead {
//   id?: string;
//   name: string;
//   email: string;
//   phone: string;
//   status: "Hot" | "Warm" | "Cold";
//   HasReached: boolean;
//   createdAt?: string;
//   needsImmediateCall: boolean;
//   requirement: string;
//   callStatus: "pending" | "completed" | "scheduled" | "failed";
//   siteVisit?: string;
//   property: string;
//   callSummary?: string;
//   followUpReason?: string;
// }

// interface LeadFormProps {
//   initialData?: Lead;
//   onSubmit: (data: Omit<Lead, "id" | "createdAt">) => void;
//   onCancel: () => void;
//   isEditing?: boolean;
// }

// export default function LeadForm({ initialData, onSubmit, onCancel, isEditing = false }: LeadFormProps) {
//   const [formData, setFormData] = useState<Omit<Lead, "id" | "createdAt">>({
//     name: initialData?.name || "",
//     email: initialData?.email || "",
//     phone: initialData?.phone || "",
//     status: initialData?.status || "Warm",
//     HasReached: initialData?.HasReached || false,
//     needsImmediateCall: initialData?.needsImmediateCall || false,
//     requirement: initialData?.requirement || "",
//     callStatus: initialData?.callStatus || "pending",
//     siteVisit: initialData?.siteVisit || "",
//     property: initialData?.property || "",
//     callSummary: initialData?.callSummary || "",
//     followUpReason: initialData?.followUpReason || "",
//   })

  
//   const [siteVisitDate, setSiteVisitDate] = useState<Date | undefined>(
//     initialData?.siteVisit ? new Date(initialData.siteVisit) : undefined
//   )

//   const [errors, setErrors] = useState<Record<string, string>>({})

//   const handleInputChange = (field: keyof typeof formData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: "" }))
//     }
//   }

  
//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required"
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required"
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address"
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone number is required"
//     } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
//       newErrors.phone = "Please enter a valid phone number"
//     }

//     if (!formData.requirement.trim()) {
//       newErrors.requirement = "Requirement is required"
//     }

//     if (!formData.property.trim()) {
//       newErrors.property = "Property is required"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }
//    const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) {
//       return
//     }

//     onSubmit(formData)
//   }

//   return (
//     <DashboardLayout>
//       <h1 className="text-2xl font-semibold mb-4">
//        Add Company
//       </h1>
//       <div>
//         <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        
       
//         <div className="space-y-2">
//           <Label htmlFor="name">Company Name*</Label>
//           <Input
//             id="name"
//             value={formData.name}
//             onChange={(e) => handleInputChange("name", e.target.value)}
//             placeholder="Enter Company name"
//             className={errors.name ? "border-red-500" : ""}
//           />
//           {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="callSummary">Company Address</Label>
//           <Textarea
//             id="callSummary"
//             value={formData.callSummary}
//             onChange={(e) => handleInputChange("callSummary", e.target.value)}
//             placeholder="Enter company Address"
//             rows={3}
//           />
//         </div>

//          <div className="space-y-2">
//           <Label htmlFor="name">Admin Name*</Label>
//           <Input
//             id="name"
//             value={formData.name}
//             onChange={(e) => handleInputChange("name", e.target.value)}
//             placeholder="Enter Admin name"
//             className={errors.name ? "border-red-500" : ""}
//           />
//           {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
//         </div>
          
//            <div className="space-y-2">
//     <Label htmlFor="email">Admin Email Address* </Label>
//           <Input
//             id="email"
//             type="email"
//             value={formData.email}
//             onChange={(e) => handleInputChange("email", e.target.value)}
//             placeholder="Enter Admin email address"
//             className={errors.email ? "border-red-500" : ""}
//           />
//           {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="name">Admin Password*</Label>
//           <Input
//             id="name"
//             value={formData.name}
//             onChange={(e) => handleInputChange("name", e.target.value)}
//             placeholder="Enter Admin Password"
//             className={errors.name ? "border-red-500" : ""}
//           />
//           {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
//         </div>
        

//         <div className="space-y-2">
//           <Label htmlFor="phone">Admin Phone Number *</Label>
//           <Input
//             id="phone"
//             value={formData.phone}
//             onChange={(e) => handleInputChange("phone", e.target.value)}
//             placeholder="+91 9123456789"
//             className={errors.phone ? "border-red-500" : ""}
//           />
//           {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
//         </div>
//       </div> 

  
//       <div className="flex justify-end space-x-2 pt-4">
//         <Button type="button" variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button type="submit">
//           {isEditing ? "Update Lead" : "Submit"}
//         </Button>
//       </div>
//     </form>
        

//       </div>
//     </DashboardLayout>

//   )
// }
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, User, Mail, Phone, Lock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompanyFormData {
  companyName: string;
  companyAddress: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminPhone: string;
}

interface CompanyFormProps {
  initialData?: CompanyFormData;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function CompanyForm({ initialData, onSubmit, onCancel, isEditing = false }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: initialData?.companyName || "",
    companyAddress: initialData?.companyAddress || "",
    adminName: initialData?.adminName || "",
    adminEmail: initialData?.adminEmail || "",
    adminPassword: initialData?.adminPassword || "",
    adminPhone: initialData?.adminPhone || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) newErrors.companyName = "Required"
    if (!formData.companyAddress.trim()) newErrors.companyAddress = "Required"
    if (!formData.adminName.trim()) newErrors.adminName = "Required"
    
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = "Required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = "Invalid email"
    }

    if (!formData.adminPassword.trim()) {
      newErrors.adminPassword = "Required"
    } else if (formData.adminPassword.length < 6) {
      newErrors.adminPassword = "Min 6 chars"
    }

    if (!formData.adminPhone.trim()) {
      newErrors.adminPhone = "Required"
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.adminPhone.replace(/\s/g, ""))) {
      newErrors.adminPhone = "Invalid phone"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    console.log(formData)
    setIsSubmitting(true)
    try {
      createCompany
      // await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col max-w-7xl p-4">
        <div className="flex-shrink-0 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Company" : "Add New Company"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update company and admin details" : "Create company with admin credentials"}
          </p>
        </div>

        <Card className="border-0 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Details - Left Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Company Details</h3>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1">
                    <Label htmlFor="companyName" className="text-xs font-medium">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="Enter company name"
                      className={cn(
                        "h-8 text-sm transition-colors",
                        errors.companyName && "border-destructive"
                      )}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-destructive">{errors.companyName}</p>
                    )}
                  </div>

                  {/* Company Address */}
                  <div className="space-y-1">
                    <Label htmlFor="companyAddress" className="text-xs font-medium">
                      Company Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="companyAddress"
                      value={formData.companyAddress}
                      onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                      placeholder="Enter complete company address"
                      rows={3}
                      className={cn(
                        "text-sm resize-none transition-colors",
                        errors.companyAddress && "border-destructive"
                      )}
                    />
                    {errors.companyAddress && (
                      <p className="text-xs text-destructive">{errors.companyAddress}</p>
                    )}
                  </div>
                </div>

                {/* Admin Details - Right Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-md">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-foreground">Admin Details</h3>
                  </div>

                  {/* Admin Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="adminName" className="text-xs font-medium">
                        Admin Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="adminName"
                        value={formData.adminName}
                        onChange={(e) => handleInputChange("adminName", e.target.value)}
                        placeholder="Full name"
                        className={cn(
                          "h-8 text-sm transition-colors",
                          errors.adminName && "border-destructive"
                        )}
                      />
                      {errors.adminName && (
                        <p className="text-xs text-destructive">{errors.adminName}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="adminPhone" className="text-xs font-medium">
                        Admin Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="adminPhone"
                        value={formData.adminPhone}
                        onChange={(e) => handleInputChange("adminPhone", e.target.value)}
                        placeholder="+91 9876543210"
                        className={cn(
                          "h-8 text-sm transition-colors",
                          errors.adminPhone && "border-destructive"
                        )}
                      />
                      {errors.adminPhone && (
                        <p className="text-xs text-destructive">{errors.adminPhone}</p>
                      )}
                    </div>
                  </div>

                  {/* Admin Email and Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="adminEmail" className="text-xs font-medium">
                        Admin Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                        placeholder="admin@company.com"
                        className={cn(
                          "h-8 text-sm transition-colors",
                          errors.adminEmail && "border-destructive"
                        )}
                      />
                      {errors.adminEmail && (
                        <p className="text-xs text-destructive">{errors.adminEmail}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="adminPassword" className="text-xs font-medium">
                        Admin Password <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={formData.adminPassword}
                        onChange={(e) => handleInputChange("adminPassword", e.target.value)}
                        placeholder="Min 6 characters"
                        className={cn(
                          "h-8 text-sm transition-colors",
                          errors.adminPassword && "border-destructive"
                        )}
                      />
                      {errors.adminPassword && (
                        <p className="text-xs text-destructive">{errors.adminPassword}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="flex-shrink-0  bg-muted/10 px-6 py-3">
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isSubmitting}
                  size="sm"
                  className="min-w-20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  size="sm"
                  className="min-w-24"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEditing ? "Update" : "Submit"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}