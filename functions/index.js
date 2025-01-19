const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Import Routers
const userRouter = require("./routes/userRoutes");
const agentRouter = require("./routes/agentRoutes");
const providerRouter = require("./routes/providerRoutes");
const agencyRouter = require("./routes/agencyRoutes");
const listingRouter = require("./routes/listingRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const locationsRouter = require("./routes/locationsRoutes");
const adminRouter = require("./routes/adminRoutes");

// Initialize Express App
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(helmet());
app.use(express.json());

// Base API Version
const BASE_API = "/app/v1";

// Routes
app.use(`${BASE_API}/users`, userRouter);
app.use(`${BASE_API}/admin`, adminRouter);
app.use(`${BASE_API}/agents`, agentRouter);
app.use(`${BASE_API}/providers`, providerRouter);
app.use(`${BASE_API}/agencies`, agencyRouter);
app.use(`${BASE_API}/listings`, listingRouter);
app.use(`${BASE_API}/categories`, categoryRouter);
app.use(`${BASE_API}/locations`, locationsRouter);

// Export API
exports.api = functions.https.onRequest(app);
