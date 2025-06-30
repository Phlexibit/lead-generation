"use client"
import React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { companyApi } from "@/lib/api" // Adjust the import path as per your project structure
export function useCompany() {
  const queryClient = useQueryClient()
  const createCompanyMutation = useMutation({
    mutationFn: (companyData: any) => companyApi.createCompany(companyData),
    onSuccess: (company) => {
      console.log('Company created successfully:', company)
      // Store or update company in React Query cache
      queryClient.setQueryData(["currentCompany"], company)
      // Optionally: handle state update if you have a store like useCompanyStore
    },
    onError: (error) => {
      console.error('Company creation failed:', error)
    }
  })
  return {
    createCompany: createCompanyMutation.mutate,
    isCreating: createCompanyMutation.isPending,
    createCompanyError: createCompanyMutation.error?.message,
  }
}