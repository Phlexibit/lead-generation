// API Configuration
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const API_BASE_URL = "http://localhost:5000/api"

// Define custom URLs for specific endpoints
const CUSTOM_ENDPOINTS = {
  '/manual-lead-entry': process.env.NEXT_PUBLIC_API_PYTHON_URL,
  '/edit-lead': process.env.NEXT_PUBLIC_API_PYTHON_URL,
  '/delete-lead': process.env.NEXT_PUBLIC_API_PYTHON_URL,
}

const buildUrl = (endpoint: string) => {
  const customUrl = CUSTOM_ENDPOINTS[endpoint as keyof typeof CUSTOM_ENDPOINTS]

  if (customUrl) {
    return `${customUrl}${endpoint}`
  }

  // Use default base URL
  return `${API_BASE_URL}${endpoint}`
}

// const buildUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`

const getAuthToken = () => localStorage.getItem('authToken')

const getUserFromLocalStorage = () => localStorage.getItem('currentUser')

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'An error occurred')
  }

  return response.json()
}

export interface Role {
  name: string;
  _id: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  number: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  refresh_token?: string;
}

export interface TeamMember {
  _id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  number: string;
  roles: Role[];
  password: string;
}
export interface TeamMemberPublic {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  roles: Role[];
}


// Auth API
export const authApi = {
  login: async (email: string, username_or_email?: string, password: string): Promise<User> => {
    const response = await fetchApi<{ user: User; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // Save both the token and user data
    console.log('response', response)
    localStorage.setItem('authToken', response.data.token)
    localStorage.setItem("currentUser", JSON.stringify(response.data.user))
    return response.data.user
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = getAuthToken();
      if (!token) return null;
      const currentUser = getUserFromLocalStorage();
      if (!currentUser) return null;
      const parsedUser = JSON.parse(currentUser) as User;
      const response = await fetchApi<{ user: User }>(`/user?id=${parsedUser._id}`)
      return response.user
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: Omit<User, "id"> & { password: string }): Promise<User> => {
    const response = await fetchApi<{ user: User }>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    localStorage.setItem("currentUser", JSON.stringify(response.user))
    return response.user
  },

  logout: async (): Promise<void> => {
    try {
      await fetchApi('/logout', { method: 'POST' })
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
    }
  },
}

export const leadsApi = {
  getAllLeads: async (projectId?: string): Promise<any> => {
    try {
      const response = await fetchApi<{ response: any }>(`/leads?projectId=${projectId}`);
      return response || null;
    } catch (error) {
      throw error;
    }
  },

  getLead: async (sessionId: string): Promise<any> => {
    try {
      const response = await fetchApi<{ session: any }>(``);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addLead: async (leadData: string): Promise<any> => {
    try {
      const response = await fetchApi<{ data: any }>('/manual-lead-entry', {
        method: 'POST',
        body: JSON.stringify(leadData),
      })

      console.log('response', response)

      return response;
    } catch (error) {
      throw error;
    }
  },

  updateLead: async (id: string, data: any): Promise<any> => {
    try {
      const response = await fetchApi<{ lead: any }>(`/edit-lead`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteLead: async (lead_id: string): Promise<any> => {
    try {
      let temp = {
        lead_id
      }
      const response = await fetchApi<{ lead: any }>(`/delete-lead`, {
        method: 'DELETE',
        body: JSON.stringify(temp)
      });
      return response;
    } catch (error) {
      throw error;
    }
  },


}

// export const companyApi = {
//   createCompany: async (companyData: any): Promise<any> => {
//     const response = await fetchApi<any>('/company', {
//       method: 'POST',
//       body: JSON.stringify(companyData),
//     });
//     return response;
//   },
// };

export const companyApi = {
  // Your existing createCompany method
  createCompany: async (companyData: any): Promise<any> => {
    const response = await fetchApi<{ company: any }>('/company', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
    return response.company;
  },

  // Additional methods
  // getAllCompanies: async (): Promise<any[]> => {
  //   try {
  //     const response = await fetchApi<{ companies: any[] }>('/companies');
  //     return response.companies || [];
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // getCompany: async (id: string): Promise<any> => {
  //   try {
  //     const response = await fetchApi<{ company: any }>(`/company/${id}`);
  //     return response.company;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // updateCompany: async (id: string, companyData: Partial<any>): Promise<any> => {
  //   try {
  //     const response = await fetchApi<{ company: any }>(`/company/${id}`, {
  //       method: 'PUT',
  //       body: JSON.stringify(companyData),
  //     });
  //     return response.company;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // deleteCompany: async (id: string): Promise<void> => {
  //   try {
  //     await fetchApi(`/company/${id}`, {
  //       method: 'DELETE'
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // createCompaniesCsv: async (companies: Omit<Company, "_id" | "createdAt" | "updatedAt" | "__v">[]): Promise<Company[]> => {
  //   try {
  //     const response = await fetchApi<{ companies: Company[] }>('/companies/csv', {
  //       method: 'POST',
  //       body: JSON.stringify({ companies })
  //     });
  //     return response.companies;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}



export const teamApi = {
  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      const response = await fetchApi<{ users: TeamMember[] }>(`/user`)
      if (!response) return [];
      return response.users
    } catch (error) {
      throw error;
    }
  },

  getMemberListPublic: async (): Promise<TeamMemberPublic[]> => {
    try {
      const response = await fetchApi<{ users: TeamMemberPublic[] }>(`/user-list`)
      if (!response) return [];
      return response.users
    } catch (error) {
      throw error;
    }
  },

  addTeamMember: async (member: Omit<TeamMember, "_id">): Promise<TeamMember> => {
    try {
      const response = await fetchApi<{ user: TeamMember }>('/register', {
        method: 'POST',
        body: JSON.stringify(member)
      });
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  addTeamMembersCsv: async (members: Omit<TeamMember, "_id">[]): Promise<TeamMember[]> => {
    try {
      const response = await fetchApi<{ users: TeamMember[] }>('/csv-add-users', {
        method: 'POST',
        body: JSON.stringify({ users: members })
      });
      return response.users;
    } catch (error) {
      throw error;
    }
  },

  updateTeamMember: async (id: string, member: Partial<TeamMember>): Promise<TeamMember> => {
    try {
      const response = await fetchApi<{ user: TeamMember }>(`/user/${id}`, {
        method: 'PUT',
        body: JSON.stringify(member)
      });
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  deleteTeamMember: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/user/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(id) // this is to avoid fastify body error
      });
    } catch (error) {
      throw error;
    }
  },

}

export const dashboardApi = {
  getDashboardData: async (projectId?: string): Promise<any> => {
    try {
      const response = await fetchApi<{ data: any }>(`/dashboard-data?projectId=${projectId}`);
      if (!response) return null;
      return response
    } catch (error) {
      throw error;
    }
  },
}

export const siteVisitsApi = {
  getSiteVisits: async (projectId?: string): Promise<any> => {
    try {
      const response = await fetchApi<{ response: any }>(`/site-visits?projectId=${projectId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const projectsApi = {
  getProjects: async (userId?: string): Promise<any> => {
    try {
      // If userId is not provided, get it from localStorage
      if (!userId) {
        const currentUser = getUserFromLocalStorage()
        userId = currentUser?.id || currentUser?._id
      }

      if (!userId) {
        throw new Error('User ID is required')
      }

      const response = await fetchApi<{ data: any }>(`/project-list/${userId}`);
      if (!response) return null;
      return response
    } catch (error) {
      throw error;
    }
  },
}