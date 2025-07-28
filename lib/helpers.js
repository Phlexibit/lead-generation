const Role = require("../modules/roles/models");
const User = require("../modules/user/models");

/**
 * Helper function to check if user can assign tasks to target user
 *
 * */

const hierarchy = {
  admin: 4,
  ceo: 3,
  "team leader": 2,
  "team member": 1,
};

const roleHierarchy = {
  Admin: "CEO",
  CEO: "Team Leader",
  "Team Leader": "Team Member",
  "Team Member": null,
};

const canAssignTo = async (assignerUserRole, targetUserId) => {
  try {
    const assginerRoleLowerCase = assignerUserRole.toLowerCase();

    if (assginerRoleLowerCase === "team member") {
      return false;
    }

    const assignerLevel = hierarchy[assginerRoleLowerCase] || 0;

    const target = await User.findById(targetUserId)
      .select("roles")
      .populate("roles", "name -_id")
      .lean();

    if (!target) {
      return false;
    }
    const targetLevel = target.roles.reduce((maxLevel, role) => {
      const level = hierarchy[role.name.toLowerCase()] || 0;
      return level > maxLevel ? level : maxLevel;
    }, 0);
    return assignerLevel >= targetLevel;
  } catch (error) {
    console.error("Error checking assignment permissions:", error);
    return false;
  }
};

const getNextLowerRoleUser = async (currentRole) => {
  try {
    const currentRoleLower = currentRole;
    const nextRole = roleHierarchy[currentRoleLower];

    if (!nextRole) {
      return null;
    }

    const roleDoc = await Role.findOne({
      name: { $regex: new RegExp(nextRole, "i") },
    });

    if (roleDoc) {
      const userWithRole = await User.findOne({
        roles: roleDoc._id,
      }).lean();

      if (userWithRole) {
        return userWithRole._id;
      }
    }
    return null;
  } catch (error) {
    console.error("Error finding next lower role user:", error);
    return null;
  }
};

module.exports = {
  canAssignTo,
  getNextLowerRoleUser,
};
