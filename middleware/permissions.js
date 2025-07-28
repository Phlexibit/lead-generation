const temp = [
  {
    role: "Admin",
    routesAllowed: [
      {
        route: "all",
        methods: ["all"],
      },
    ],
  },
  {    role: "CEO",
    routesAllowed: [
      {
        route: "user",
        methods: ["GET", "POST", "PUT", "DELETE"]
      },
      {
        route: "task",
        methods: ["GET", "POST", "PUT", "DELETE"]
      },
      {
        route: "assign-task",
        methods: ["POST", "DELETE"]
      },
      {
        route: "goal",
        methods: ["GET", "POST", "PUT", "DELETE"]
      },
      {
        route: "assign-goal",
        methods: ["POST", "DELETE"]
      },
    ],
  },
  {    role: "Team Leader",
    routesAllowed: [
      {
        route: "task",
        methods: ["GET", "POST", "PUT"]
      },
      {
        route: "assign-task",
        methods: ["POST", "DELETE"]
      },
      {
        route: "user",
        methods: ["GET", "PUT"]
      },
      {
        route: "goal",
        methods: ["GET", "POST", "PUT"]
      },
      {
        route: "assign-goal",
        methods: ["POST", "DELETE"]
      }
    ],
  },
  {    role: "Team Member",
    routesAllowed: [
      {
        route: "task",
        methods: ["GET"]
      },
      {
        route: "user",
        methods: ["GET"]
      },
      {
        route: "goal",
        methods: ["GET"]
      }
    ],
  },
];

const permissions = (role, type, method) => {
  const roleConfig = temp.find(r => r.role === role);
  if (!roleConfig) return false;

  // Admin has access to everything
  if (role === 'Admin') return true;

  // For other roles, check specific route permissions
  const routeConfig = roleConfig.routesAllowed?.find(r => r.route === type);
  if (!routeConfig) return false;

  return routeConfig.methods.includes(method) || routeConfig.methods.includes('all');
};

const checkPermission = (req, res, next) => {
  try {
    const role = req.user?.role;
    if (!role) {
      return res.status(403).json({
        success: false,
        message: 'Role not found in user data'
      });
    }

    // Extract route type from the URL
    const urlParts = req.originalUrl.split('/');
    const routeType = urlParts[urlParts.length - 1].split('?')[0];

    // Check if user has permission
    const hasPermission = permissions(role, routeType, req.method);
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking permissions',
      error: error.message
    });
  }
};

module.exports = {
  permissions,
  checkPermission
};