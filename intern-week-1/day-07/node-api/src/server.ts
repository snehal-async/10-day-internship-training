import { app } from "./app.js";
import { config } from "./config/environment.js";

const server = app.listen(config.port, () => {
  console.log(`
=====================================================
🚀 Node.js + Express REST API Server Running!
📡 Port       : ${config.port}
🌐 Base URL   : http://localhost:${config.port}
🩺 Health Check: http://localhost:${config.port}/api/health
👥 Employees  : http://localhost:${config.port}/api/employees
📊 Statistics : http://localhost:${config.port}/api/employees/stats
🔑 Demo Auth  : Authorization: Bearer ${config.demoApiKey}
=====================================================
`);
});

// Graceful process shutdown
process.on("SIGTERM", () => {
  console.log("[Server] SIGTERM received. Gracefully shutting down...");
  server.close(() => {
    console.log("[Server] Closed active connections.");
    process.exit(0);
  });
});