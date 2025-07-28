require("dotenv").config();
const { StatusCodes } = require("http-status-codes");

const wsLead = async (req, res) => {
  try {
    let lead = {
      _id: "6853e186f58c0447cf58beww",
      first_name: "LeadNew",
      last_name: "Client",
      google_sheet_id: "testting_2209",
      contact_number: "+0000000000",
      requirement: "3BHK",
      call_status: "completed",
      projectName: "Naroda Lavish",
      full_conversation:
        "2025-06-17 14:30:00 - agent: Hello, I am Aakash calling from Satya Sankalp Developers. Am I speaking with Mr. Rajesh Kumar?\n2025-06-17 14:30:05 - user: Yes, this is Rajesh speaking. I filled out your form yesterday for a 3BHK apartment.\n2025-06-17 14:30:15 - agent: Perfect! Thank you for your interest in Naroda Lavish project. We have beautiful 3BHK apartments starting from 65 lakhs with modern amenities like swimming pool, gym, and children's play area.\n2025-06-17 14:30:30 - user: That sounds great! I'm very interested. Can you tell me more about the location and when can I visit the site?\n2025-06-17 14:30:45 - agent: Absolutely! The project is strategically located in Naroda with excellent connectivity. Would you like to schedule a site visit this weekend?\n2025-06-17 14:31:00 - user: Yes, I would love to visit. Can we schedule it for Saturday at 3 PM? I'll bring my wife along.\n2025-06-17 14:31:15 - agent: Perfect! I have scheduled your site visit for Saturday, June 21st at 3:00 PM. Our sales manager will be there to show you around. Please bring your ID proof.\n2025-06-17 14:31:30 - user: Excellent! Also, what about home loan assistance? And can you share the brochure?",
      call_summary:
        "Mr. Rajesh Kumar expressed interest in a 3BHK apartment at the Naroda Lavish project and scheduled a site visit for June 21st at 3 PM.",
      is_hot_lead: true,
      reached: true,
      transfered: true,
      site_visit: "2025-06-21T15:00:00.000Z",
      reason_of_transfer:
        "The user inquired about home loan assistance and requested the brochure, which the agent did not provide.",
      createdAt: "2025-06-19T10:08:06.577Z",
      updatedAt: "2025-06-19T10:08:06.577Z",
    };

    return res.status(StatusCodes.OK).json({
      msg: "lead",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const { startDate, endDate, projectId, ...otherFilters } = req.query;
    
    // Validate date format if provided
    if (startDate && !Date.parse(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate format. Use YYYY-MM-DD format.'
      });
    }
    
    if (endDate && !Date.parse(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate format. Use YYYY-MM-DD format.'
      });
    }
    
    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'startDate cannot be after endDate.'
      });
    }
    
    // Build filter object
    let filter = {};
    
    // Add date range filtering
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDateTime;
      }
    }
    
    // Add project filter
    if (projectId) {
      filter.projectId = projectId;
    }
    
    // Add other filters
    Object.keys(otherFilters).forEach(key => {
      if (otherFilters[key] !== undefined && otherFilters[key] !== '') {
        filter[key] = otherFilters[key];
      }
    });

    // For now, return mock data with filtering
    let mockLeads = [
      {
        _id: "6853e186f58c0447cf58beww",
        first_name: "LeadNew",
        last_name: "Client",
        google_sheet_id: "testting_2209",
        contact_number: "+0000000000",
        requirement: "3BHK",
        call_status: "completed",
        projectName: "Naroda Lavish",
        full_conversation: "2025-06-17 14:30:00 - agent: Hello...",
        call_summary: "Mr. Rajesh Kumar expressed interest in a 3BHK apartment...",
        is_hot_lead: true,
        reached: true,
        transfered: true,
        site_visit: "2025-06-21T15:00:00.000Z",
        reason_of_transfer: "The user inquired about home loan assistance...",
        createdAt: "2025-06-19T10:08:06.577Z",
        updatedAt: "2025-06-19T10:08:06.577Z",
        projectId: "project_1",
      },
      {
        _id: "6853e186f58c0447cf58bewx",
        first_name: "Sarah",
        last_name: "Johnson",
        google_sheet_id: "testting_2210",
        contact_number: "+91 9123867523",
        requirement: "4BHK",
        call_status: "completed",
        projectName: "Naroda Lavish",
        full_conversation: "2025-06-17 15:30:00 - agent: Hello...",
        call_summary: "Sarah Johnson interested in 4BHK apartment...",
        is_hot_lead: true,
        reached: true,
        transfered: true,
        site_visit: "2025-06-22T16:00:00.000Z",
        reason_of_transfer: "Client requested detailed pricing...",
        createdAt: "2025-06-20T11:08:06.577Z",
        updatedAt: "2025-06-20T11:08:06.577Z",
        projectId: "project_1",
      },
      {
        _id: "6853e186f58c0447cf58bewy",
        first_name: "Michael",
        last_name: "Chen",
        google_sheet_id: "testting_2211",
        contact_number: "+91 7789867523",
        requirement: "2BHK",
        call_status: "pending",
        projectName: "Tech Park Residency",
        full_conversation: "2025-06-17 16:30:00 - agent: Hello...",
        call_summary: "Michael Chen interested in 2BHK apartment...",
        is_hot_lead: false,
        reached: false,
        transfered: false,
        site_visit: null,
        reason_of_transfer: null,
        createdAt: "2025-06-21T09:08:06.577Z",
        updatedAt: "2025-06-21T09:08:06.577Z",
        projectId: "project_2",
      },
      {
        _id: "6853e186f58c0447cf58bewz",
        first_name: "Emma",
        last_name: "Davis",
        google_sheet_id: "testting_2212",
        contact_number: "+91 7564867523",
        requirement: "3BHK",
        call_status: "completed",
        projectName: "Startup Heights",
        full_conversation: "2025-06-17 17:30:00 - agent: Hello...",
        call_summary: "Emma Davis interested in 3BHK with home office...",
        is_hot_lead: false,
        reached: true,
        transfered: false,
        site_visit: "2025-06-25T12:00:00.000Z",
        reason_of_transfer: null,
        createdAt: "2025-06-22T14:08:06.577Z",
        updatedAt: "2025-06-22T14:08:06.577Z",
        projectId: "project_2",
      }
    ];

    // Apply date and project filtering to mock data
    mockLeads = mockLeads.filter(lead => {
      // Date filtering
      if (startDate || endDate) {
        const created = new Date(lead.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end) {
          end.setHours(23, 59, 59, 999);
          if (!(created >= start && created <= end)) return false;
        } else if (start) {
          if (!(created >= start)) return false;
        } else if (end) {
          end.setHours(23, 59, 59, 999);
          if (!(created <= end)) return false;
        }
      }
      
      // Project filtering
      if (projectId && lead.projectId !== projectId) {
        return false;
      }
      
      return true;
    });
    
    res.status(200).json({
      success: true,
      data: mockLeads,
      count: mockLeads.length
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: error.message
    });
  }
};

module.exports = {
  wsLead,
  getLeads,
};
