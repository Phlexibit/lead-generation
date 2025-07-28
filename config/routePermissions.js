exports.routeAuthenticate = async (role) => {
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
    {
      role: "CEO",
      routesAllowed: [
        {
          route: "user",
          methods: ["GET", "POST", "PUT"]
        },
      ],
    },
    {
      role: "Team Leader",
      routes: [""],
    },
    {
      role: "Team Member",
      routes: [""],
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
