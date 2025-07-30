"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useDashboardStore } from "@/stores/dashboard-store"
import { siteVisitsApi } from "@/lib/api"

export const useSiteVisits = (startDate?: string, endDate?: string) => {
  const { selectedProjectId } = useDashboardStore()
  const queryClient = useQueryClient()

  console.log('useSiteVisits called with:', { selectedProjectId, startDate, endDate });

  // Effect to refetch site visits when project changes
  useEffect(() => {
    if (selectedProjectId) {
      console.log('Invalidating site visits query with:', { selectedProjectId, startDate, endDate });
      queryClient.invalidateQueries({ queryKey: ["getSiteVisits", selectedProjectId, startDate, endDate] })
    }
  }, [selectedProjectId, queryClient, startDate, endDate])

  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["getSiteVisits", selectedProjectId, startDate, endDate],
    queryFn: () => {
      console.log('Executing site visits query with:', { selectedProjectId, startDate, endDate });
      return siteVisitsApi.getSiteVisits(selectedProjectId || undefined, startDate, endDate);
    },
    staleTime: 5 * 60 * 1000,
    enabled: true, // Only fetch when a project is selected
  })
  
  console.log('Site visits query result:', { data, isLoading, isError, error, isSuccess });
  
  return {
    data: data?.data || null,
    isLoading,
    isError,
    error,
    isSuccess,
  }
}
