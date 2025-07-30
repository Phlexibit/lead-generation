"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useDashboardStore } from "@/stores/dashboard-store"
import { useLeadList } from "./use-leads"

export const useLeadProject = (startDate?: string, endDate?: string) => {
  const { selectedProjectId } = useDashboardStore()
  const queryClient = useQueryClient()

  // Effect to refetch leads when project changes
  useEffect(() => {
    if (selectedProjectId) {
      queryClient.invalidateQueries({ queryKey: ["getAllLeads", selectedProjectId, startDate, endDate] })
    }
  }, [selectedProjectId, queryClient, startDate, endDate])

  // Get leads data using the existing hook
  const {
    leads,
    pagination,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useLeadList(startDate, endDate)

  return {
    leads,
    pagination,
    isLoading,
    isError,
    error,
    isSuccess,
    selectedProjectId
  }
}
