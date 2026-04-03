import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorhandler } from './middleware/eror.middlewares.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Route imports
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import roleRouter from './routes/role.routes.js';
import financeRouter from './routes/finance.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

// Route declarations
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/finance", financeRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Global Error Handler
app.use(errorhandler);

export default app;
