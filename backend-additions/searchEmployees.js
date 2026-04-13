// ============================================================
// BACKEND ADDITION for COMP3133 Assignment 2
// Add these to your existing Assignment 1 backend
// ============================================================

// ── 1. Add to typeDefs (schema) ──────────────────────────────────────────────
//
// In your existing typeDefs, add to the Query type:
//
//   searchEmployees(department: String, designation: String): [Employee]
//
// Example:
//   type Query {
//     login(username: String!, password: String!): AuthPayload
//     getAllEmployees: [Employee]
//     getEmployeeById(id: ID!): Employee
//     searchEmployees(department: String, designation: String): [Employee]   # ADD THIS
//   }

// ── 2. Add to resolvers ────────────────────────────────────────────────────
//
// In your Query resolvers object, add:
//
//   searchEmployees: async (_, { department, designation }, context) => {
//     if (!context.user) throw new AuthenticationError('Not authenticated');
//     const filter = {};
//     if (department)  filter.department  = { $regex: department,  $options: 'i' };
//     if (designation) filter.designation = { $regex: designation, $options: 'i' };
//     return await Employee.find(filter);
//   },

// ── 3. CORS update ────────────────────────────────────────────────────────────
//
// Make sure your Express app allows the Angular dev origin.
// In your server.js / app.js:
//
//   app.use(cors({
//     origin: ['http://localhost:4200', 'https://YOUR_FRONTEND_DEPLOYED_URL'],
//     credentials: true
//   }));

// ── 4. Full example resolver file snippet ─────────────────────────────────────

const { AuthenticationError } = require('apollo-server-express');
const Employee = require('./models/Employee'); // adjust path as needed

const searchEmployees = async (_, { department, designation }, context) => {
  if (!context.user) throw new AuthenticationError('Not authenticated');

  const filter = {};
  if (department && department.trim())   filter.department  = { $regex: department.trim(),  $options: 'i' };
  if (designation && designation.trim()) filter.designation = { $regex: designation.trim(), $options: 'i' };

  // If no filter provided, return all
  return await Employee.find(filter).lean();
};

module.exports = { searchEmployees };
