require("dotenv").config();
const { StatusCodes } = require("http-status-codes");

const getSiteVisits = async (req, res) => {
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
      filter.visit_booking_datetime = {};
      if (startDate) {
        filter.visit_booking_datetime.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        filter.visit_booking_datetime.$lte = endDateTime;
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

    // Mock site visits data with filtering
    let mockSiteVisits = [
      {
        _id: "site_visit_1",
        first_name: "Sarah",
        last_name: "Johnson",
        contact_number: "+91 9123867523",
        project_name: "Naroda Lavish",
        visit_booking_datetime: "2025-06-15T16:00:00.000Z",
        status: "Confirmed",
        requirement: "4BHK",
        lead_type: "Hot",
        reached: true,
        call_immediately: true,
        call_connection_status: "completed",
        call_summary: "Client specifically interested in 4BHK units on higher floors. Requires parking for 2 cars.",
        created_at: "2025-06-04T13:17:51.857+00:00",
        projectId: "project_1"
      },
      {
        _id: "site_visit_2",
        first_name: "James",
        last_name: "Wilson",
        contact_number: "+91 9753867523",
        project_name: "Enterprise Towers",
        visit_booking_datetime: "2025-06-20T14:00:00.000Z",
        status: "Pending",
        requirement: "5BHK",
        lead_type: "Hot",
        reached: false,
        call_immediately: true,
        call_connection_status: "missed",
        call_summary: "Premium client interested in penthouse. Budget: 2.5-3 Cr. Requires private elevator access.",
        created_at: "2024-06-07T10:00:00.000Z",
        projectId: "project_1"
      },
      {
        _id: "site_visit_3",
        first_name: "Emma",
        last_name: "Davis",
        contact_number: "+91 7564867523",
        project_name: "Startup Heights",
        visit_booking_datetime: "2025-06-18T11:00:00.000Z",
        status: "Confirmed",
        requirement: "3BHK",
        lead_type: "Cold",
        reached: true,
        call_immediately: false,
        call_connection_status: "completed",
        call_summary: "Tech professional looking for 3BHK with dedicated home office. Interested in smart home features.",
        created_at: "2024-06-08T09:00:00.000Z",
        projectId: "project_2"
      },
      {
        _id: "site_visit_4",
        first_name: "Michael",
        last_name: "Chen",
        contact_number: "+91 7789867523",
        project_name: "Tech Park Residency",
        visit_booking_datetime: "2025-06-22T10:00:00.000Z",
        status: "Scheduled",
        requirement: "2BHK",
        lead_type: "Cold",
        reached: false,
        call_immediately: false,
        call_connection_status: "pending",
        call_summary: "Budget-conscious client comparing multiple properties. Focus on value proposition.",
        created_at: "2024-06-09T08:00:00.000Z",
        projectId: "project_2"
      },
      {
        _id: "site_visit_5",
        first_name: "Lisa",
        last_name: "Anderson",
        contact_number: "+91 8425867523",
        project_name: "Anderson Apartments",
        visit_booking_datetime: "2025-06-25T15:00:00.000Z",
        status: "Confirmed",
        requirement: "2BHK",
        lead_type: "Cold",
        reached: true,
        call_immediately: false,
        call_connection_status: "completed",
        call_summary: "Budget-conscious buyer looking for starter home. Interested in loan assistance.",
        created_at: "2024-06-06T12:00:00.000Z",
        projectId: "project_1"
      }
    ];

    // Apply date and project filtering to mock data
    mockSiteVisits = mockSiteVisits.filter(siteVisit => {
      // Date filtering
      if (startDate || endDate) {
        const visitDate = new Date(siteVisit.visit_booking_datetime);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end) {
          end.setHours(23, 59, 59, 999);
          if (!(visitDate >= start && visitDate <= end)) return false;
        } else if (start) {
          if (!(visitDate >= start)) return false;
        } else if (end) {
          end.setHours(23, 59, 59, 999);
          if (!(visitDate <= end)) return false;
        }
      }
      
      // Project filtering
      if (projectId && siteVisit.projectId !== projectId) {
        return false;
      }
      
      return true;
    });
    
    res.status(200).json({
      success: true,
      data: mockSiteVisits,
      count: mockSiteVisits.length
    });
  } catch (error) {
    console.error('Error fetching site visits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site visits',
      error: error.message
    });
  }
};

module.exports = {
  getSiteVisits,
}; 