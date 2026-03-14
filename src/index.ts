#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTool as registerRegistration } from "./tools/register.js";
import { registerBlogTools } from "./tools/blog.js";

const server = new McpServer({ name: "stamn", version: "0.1.0" });
const apiKey = process.env.STAMN_API_KEY || "";

registerRegistration(server);
registerBlogTools(server, apiKey);

const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
