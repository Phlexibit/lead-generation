"use client"

import React from "react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTeamStore } from "@/stores/team-store"
import { useDashboardStore } from "@/stores/dashboard-store"
import { leadsApi } from "@/lib/api"
import { Pagination } from "@/components/ui/pagination"
import { useWebSocket } from "@/lib/websocket"
import { toast } from "sonner"

export const useLeadList = (startDate?: string, endDate?: string) => {
  const queryClient = useQueryClient();
  const { selectedProjectId } = useDashboardStore();

  // Debug logging
  console.log('useLeadList called with:', { selectedProjectId, startDate, endDate });

  // WebSocket subscription for real-time lead updates
  // useWebSocket('leadUpdate', (data) => {
  // Invalidate and refetch leads when we receive an update
  // queryClient.invalidateQueries({ queryKey: ["getAllLeads", selectedProjectId] });
  // });

  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["getAllLeads", selectedProjectId, startDate, endDate],
    queryFn: () => {
      console.log('Fetching leads with params:', { selectedProjectId, startDate, endDate });
      return leadsApi.getAllLeads(selectedProjectId || undefined, startDate, endDate);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!selectedProjectId, // Only fetch when a project is selected
  })

  // Debug logging for response
  console.log('Leads response:', { data, isLoading, isError, error });

  return {
    leads: data?.data || [],
    pagination: data?.pagination || null,
    isLoading,
    isError,
    error,
    isSuccess,
  }
}

export function useLeads() {
  const queryClient = useQueryClient()

  const { selectedProjectId } = useDashboardStore();

  const addLeadMutation = useMutation({
    mutationFn: (lead: any) => leadsApi.addLead({ ...lead, projectId: selectedProjectId }),
    onSuccess: (newLead) => {
      toast.success(`Lead created successfully!`)
      // addMember(newMember)
      queryClient.invalidateQueries({ queryKey: ["getAllLeads", selectedProjectId] })
    },
    onError: (error: any) => {
      toast.error('Error creating Lead', {
        description: error?.message ? error?.message : error,
      })
    }
  })

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      leadsApi.updateLead(id, data),
    onSuccess: (updatedLead) => {
      toast.success(`Lead updated successfully!`)
      // Update store with the full updated member from API response
      // updateMember(updatedMember._id, updatedMember)
      queryClient.invalidateQueries({ queryKey: ["getAllLeads", selectedProjectId] })
    },
    onError: (error: any) => {
      toast.error('Error updating Lead', {
        description: error?.message ? error?.message : error,
      })
    }
  })

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: (_, id) => {
      toast.success(`Lead Deleted successfully!`)
      // removeMember(id)
      queryClient.invalidateQueries({ queryKey: ["getAllLeads", selectedProjectId] })
    },
    onError: (error: any) => {
      toast.error('Error updating Lead', {
        description: error?.message ? error?.message : error,
      })
    }
  })

  //   const addMembersCsvMutation = useMutation({
  //     mutationFn: (members: Omit<TeamMember, "_id">[]) => teamApi.addTeamMembersCsv(members),
  //     onSuccess: (newMembers) => {
  //       // Add all new members to the store
  //       newMembers.forEach(member => addMember(member));
  //       queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
  //     },
  //   });

  //   // Update store when query data changes
  //   React.useEffect(() => {
  //     if (teamMembers) {
  //       setMembers(teamMembers)
  //     }
  //   }, [teamMembers, setMembers])

  return {
    addLead: addLeadMutation.mutate,
    isAddingLead: addLeadMutation.isPending,
    updateLead: (id: string, data: Partial<any>) => updateLeadMutation.mutate({ id, data }),
    isUpdatingMember: updateLeadMutation.isPending,
    deleteLead: deleteLeadMutation.mutate,
    isDeletingLead: deleteLeadMutation.isPending,
    //     isLoading,
    //     addMembersCsv: addMembersCsvMutation.mutate,
  }
}
