"use client"

import React from "react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTeamStore } from "@/stores/team-store"
import { leadsApi, projectsApi, teamApi, TeamMember } from "@/lib/api"
import { Pagination } from "@/components/ui/pagination"
import { useWebSocket } from "@/lib/websocket"
import { Lead } from "@/components/lead-form"

export const useLeadList = () => {
  const queryClient = useQueryClient();
  const addLeadMutation = useMutation({ /* ... */ });

  // WebSocket subscription for real-time lead updates
  // useWebSocket('leadUpdate', (data) => {
    // Invalidate and refetch leads when we receive an update
    // queryClient.invalidateQueries({ queryKey: ["getAllLeads"] });
  // });

  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["getAllLeads"],
    queryFn: leadsApi.getAllLeads,
    staleTime: 5 * 60 * 1000,
  })
  
  
  return {
    leads: data?.data || [],
    pagination: data?.pagination || null,
    isLoading,
    isError,
    error,
    isSuccess,
  }
}

export function useLead() {
  // const { members, setMembers, addMember, updateMember, removeMember } = useTeamStore()
  const queryClient = useQueryClient()

  // const { data: teamMembers, isLoading } = useQuery({
  //   queryKey: ["teamMembers"],
  //   queryFn: teamApi.getTeamMembers,
  //   staleTime: 5 * 60 * 1000,
  // })

  // const addMemberMutation = useMutation({
  //   mutationFn: (member: Omit<TeamMember, "_id">) => teamApi.addTeamMember(member),
  //   onSuccess: (newMember) => {
  //     addMember(newMember)
  //     queryClient.invalidateQueries({ queryKey: ["teamMembers"] })
  //   },
  // })
  const addLeadMutation = useMutation({
    mutationFn: (lead: Omit<any, "_id">) => leadsApi.addLead(lead),
    onSuccess: (newLead) => {
      // addMember(newLead)
console.log("success")
      queryClient.invalidateQueries({ queryKey: ["getAllLeads"] })
    },
  })
   const addProjectMutation = useMutation({
    mutationFn: (lead: Omit<any, "_id">) => projectsApi.getAllprojects(),
    onSuccess: (newProject) => {
      // addMember(newLead)
console.log("success")
      queryClient.invalidateQueries({ queryKey: ["getAllProjects"] })
    },
  })
  


function addMember(newMember: TeamMember) {
  throw new Error("Function not implemented.")
}
//   const updateMemberMutation = useMutation({
//     mutationFn: ({ id, member }: { id: string; member: Partial<TeamMember> }) =>
//       teamApi.updateTeamMember(id, member),
//     onSuccess: (updatedMember) => {
//       // Update store with the full updated member from API response
//       updateMember(updatedMember._id, updatedMember)
//       queryClient.invalidateQueries({ queryKey: ["teamMembers"] })
//     },
//   })

//   const deleteMemberMutation = useMutation({
//     mutationFn: (id: string) => teamApi.deleteTeamMember(id),
//     onSuccess: (_, id) => {
//       removeMember(id)
//       queryClient.invalidateQueries({ queryKey: ["teamMembers"] })
//     },
//   })

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
function addLead(newLead: any) {
  console.log('this is add lead called')
  throw new Error("Function not implemented.")
}

  return {
//     members: members.length > 0 ? members : teamMembers || [],
//     isLoading,
//     addMember: addMemberMutation.mutate,
       addLead: addLeadMutation.mutate,
       addProject: addProjectMutation.mutate,
//     addMembersCsv: addMembersCsvMutation.mutate,
//     updateMember: (id: string, member: Partial<TeamMember>) => updateMemberMutation.mutate({ id, member }),
//     deleteMember: deleteMemberMutation.mutate,
//     isAddingMember: addMemberMutation.isPending,
      isAddingLead: addLeadMutation.isPending,
//     isAddingMembersCsv: addMembersCsvMutation.isPending,
//     isUpdatingMember: updateMemberMutation.isPending,
//     // isDeletingMember: deleteMemberMutation.isPending,
 }
 
}

