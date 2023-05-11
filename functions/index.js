const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const userRouter = require("./routes/userRoutes");
const agentRouter = require("./routes/agentRoutes");
const providerRouter = require("./routes/providerRoutes");
const agencyRouter = require("./routes/agencyRoutes");
const listingRouter = require("./routes/listingRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const locationsRouter = require("./routes/locationsRoutes");


app.use(cors({ origin: true }));
app.use(helmet());
app.use(express.json());

//routes

app.use("/app/v1/users", userRouter);
app.use("/app/v1/agents", agentRouter);
app.use("/app/v1/providers", providerRouter);
app.use("/app/v1/agencies", agencyRouter);
app.use("/app/v1/listings", listingRouter);
app.use("/app/v1/categories", categoryRouter);
app.use("/app/v1/locations", locationsRouter);



exports.api = functions.https.onRequest(app);
