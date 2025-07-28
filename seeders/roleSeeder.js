const mongoose = require('mongoose');
const Role = require("../modules/roles/models");
const connectDB = require("../db/connect");
require('dotenv').config();

const defaultRoles = [
  {
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: [
     "all:all"
    ],
    is_default: true,
  },  {
    name: "CEO",
    description: "Can manage goals, tasks, team leads, and team members",
    permissions: [
      "users:create", "users:read", "users:update",
      "tasks:create", "tasks:read", "tasks:update", "tasks:assign", "tasks:delete",
      "goals:create", "goals:read", "goals:update", "goals:assign", "goals:delete",
    ],
    is_default: true,
  },
  {
    name: "Team Leader",
    description: "Can manage goals, tasks and team members",
    permissions: [
      "users:read", "users:update",
      "tasks:read", "tasks:update", "tasks:assign",
      "goals:read", "goals:update", "goals:assign",
    ],
    is_default: true,
  },
  {
    name: "Team Member",
    description: "Can work on assigned goals and tasks",
    permissions: [
      "users:read", 
      "tasks:read",
      "goals:read"
    ],
    is_default: true,
  },
];

async function checkCollectionExists(collectionName) {
  const collections = await mongoose.connection.db.listCollections().toArray();
  return collections.some(collection => collection.name === collectionName);
}

async function seedDefaultRoles() {
  try {
    // First connect to the database
    await connectDB(process.env.MONGO_URI);

    // Check if roles collection exists
    const rolesCollectionExists = await checkCollectionExists('roles');
    if (!rolesCollectionExists) {
      console.log('🚀 Creating roles collection and seeding default roles...');
      await Role.insertMany(defaultRoles);
      console.log("Default roles created successfully");
    } else {
      
      const existingRoles = await Role.find({ is_default: true });
      
      if (existingRoles.length === 0) {
        await Role.insertMany(defaultRoles);
        console.log("✅ Default roles seeded successfully");
      } else {
        console.log("ℹ️ Default roles already exist");
      }
    }

  } catch (error) {
    console.error("❌ Error seeding default roles:", error);
    process.exit(1);
  }
}

// Run the seeder
seedDefaultRoles();