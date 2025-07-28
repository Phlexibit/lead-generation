
exports.routeAuthenticate = async (token) => {
  const temp = [
    {
      routes: ["department"],
      access: token.is_access_to_department,
    },
    // ROLE FOR BDE's
    {
      routes: ["leave-request-details"],
      access: token.is_access_to_leaveDetails,
    },
    {
      routes: [
        "get-all-announcement",
        "read-announcement",
        "get-all-notification",
        "update-interview",
        "interview",
        "past-interview",
        "absentees",
        "create-feedback",
        "employee-with-name",
        "getuser",
        "getDetails",
        "celebration",
        "user-join",
        "leave-balance-employee",
        "create-leave-data",
        "update-mpin",
      ],
      access: token.is_access_to_dashboard || true,
    },
    {
      routes: [
        "employee",
        "deleted-employee",
        "upload-image",
        "update-leave-status",
        "user",
        "user-flag-manage",
        "invite",
        "user-join",
        "global-search",
        "senior-role",
        "assign_senior",
        "supplier",
        "brand",
        "item",
        "model",
        "publicAnnouncement",
        "holidays",
        "assets",
        "show-department",
        "party",
        "get-party",
        "close-party",
        "show-employee_list",
        "send-forgot-puch-mail",
        "leave-balance",
        "leave-balance-sheet",
        "feedback-from-employee",
        "uploadCV",
        "project-names",
      ],
      access: token.is_access_to_employee,
    },
    {
      routes: ["role", "parent-role"],
      access: token.is_access_to_roles,
    },
    {
      routes: [
        "admin-setting",
        "get_ip_setting",
        "monthly-attendance-report",
        "find-employee-from-easy-time-id",
        "create-interview",
        "update-interview",
        "interview",
        "delete-interview",
        "past-interview",
        "isEdit",
        "feedback-from-employee",
        "leave-request-details",
        "absentees",
        "get-feedback-count",
        "read-feedback",
        "project-names",
        "project-wise-logs",
        "employee-wise-logs",
        "project-time-spent",
        "project-time-spent-in-day",
        "send-notification-to-employee",
        "add-slack-id",
        "leave-balance-employee",
      ],
      access: token.is_admin_role,
    },
    {
      routes: [
        "project-employee",
        "project",
        "upload-logo",
        "project-access-employee",
        "project-names",
        // boards
        "board",
        "archive",
        "task-resend",
        // tasks priorities
        "priority",
        // tasks labels
        "label",
        // tasks
        "task",
        "task-file",
        //task comments
        "task-comment",
        //task assignment
        "task-assignment",
        // task-label-relations
        "task-label-relations",
      ],
      access: token.is_access_to_project,
    },
    {
      routes: ["technical-employee-view"],
      access: token.is_techinal_employee_view,
    },
    {
      routes: [
        "address",
        "bankdetails",
        "document",
        "document-upload",
        "eduction",
        "leave",
        "leave-dates",
        "update-leave-date",
        "delete-leave-date",
        "nominee",
        "work",
        "show-employee",
        "employee",
        "show-department",
        "show-role",
        "upload-image",
        "get-party",
        "response-party",
        "find-party",
        "send-bug-or-suggetions",
        "project-tree-view",
        "create-employee-notes",
        "employee-attendance-data",
        "all-employee-attendance-data",
        "set-working-project",
        "start-working-on-project",
        "punch-in-or-out",
        "employee-forgot-punch",
        "get-publicAnnouncement",
        "get-holidays",
        "pending-leave-request",
        "acknowledge-leave",
        "absentees",
        "get-feedback",
        "create-credential",
        "delete-credential",
        "update-credential",
        "get-credential",
        "pin-credential",
        "pin-credential-sharing",
        "share-credential",
        "remove-credential-access",
        "shared-credential-list",
        "shared-credential-list-personal",
        "project-names",
        "submit-form",
        "employee-with-name",
        "find-employee-name-from-project",
        // boards
        "board",
        "archive",
        "task-resend",
        // tasks priorities
        "priority",
        // tasks labels
        "label",
        // tasks
        "task",
        "task-file",
        //task comments
        "task-comment",
        //task assignment
        "task-assignment",
        // task-actions
        "task-actions",
        // task-dnd-actions
        "task-dnd-actions",
        // task-label-relations
        "task-label-relations",
        // leave-balance-employee
        "leave-balance-employee",
      ],
      access: token.is_access_to_employee || token.only_employee_view,
    },
    {
      routes: [
        "login",
        "reset-password",
        "reset-password-token-check",
        "forgot-password",
        "getuser",
        "getdetails",
        // "demo-bulk-data",
        // "demo-bulk-employee",
        "mail",
        "check-token",
        "change-password",
      ],
    },
  ];
  const routesWithAccess = temp.reduce((acc, item) => {
    if (item.access) {
      return acc.concat(item.routes);
    } else {
      return acc;
    }
  }, []);
  return routesWithAccess;
};
