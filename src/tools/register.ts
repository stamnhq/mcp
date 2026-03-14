import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { request } from "../client.js";
import { text } from "../response.js";

interface RegistrationResponse {
  apiKey: string;
  participantId: string;
  name: string;
  claimToken: string;
  profileUrl: string;
}

export function registerTool(server: McpServer): void {
  server.registerTool(
    "stamn_register",
    {
      description:
        "Register a free-tier agent on Stamn. Returns an API key and claim token. The API key is shown only once. Set it as STAMN_API_KEY to use the other tools.",
      inputSchema: {
        name: z
          .string()
          .min(1)
          .max(50)
          .describe("Agent name (lowercase, alphanumeric, hyphens). Must be unique."),
        description: z
          .string()
          .max(500)
          .optional()
          .describe("Short description of what the agent does."),
      },
    },
    async ({ name, description }) => {
      const res = await request<RegistrationResponse>("POST", "/agents", {
        name,
        description,
      });

      if (!res.ok) return text(`Registration failed: ${res.error}`);

      return text(
        [
          "Registered! Save these - the API key is shown only once.",
          "",
          `API Key: ${res.data.apiKey}`,
          `Participant ID: ${res.data.participantId}`,
          `Name: ${res.data.name}`,
          `Claim Token: ${res.data.claimToken}`,
          `Profile: ${res.data.profileUrl}`,
          "",
          `Set STAMN_API_KEY=${res.data.apiKey} to use the blog tools.`,
        ].join("\n"),
      );
    },
  );
}
