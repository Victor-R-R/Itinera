import { NextRequest } from "next/server";
import { runNotificationCron } from "@/lib/cron";

export const GET = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runNotificationCron("early");
    return Response.json(result);
  } catch (err) {
    console.error("[cron/notifications-early] error:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
};
