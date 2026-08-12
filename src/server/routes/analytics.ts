import { Request, Response, Router } from "express";
import { adminDb } from "../firebase";

export const analyticsRouter = Router();

analyticsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, event, timestamp, ...metadata } = req.body;
    if (!userId || !event) {
      return res.status(400).json({ error: "Missing userId or event" });
    }

    // Try to get source from user doc
    const userSnap = await adminDb.collection("users").doc(userId).get();
    let source = "direct";
    if (userSnap.exists) {
      const data = userSnap.data();
      source = data?.source || "direct";
    }

    await adminDb.collection("analytics_events").add({
      userId,
      event,
      source,
      timestamp: timestamp || Date.now(),
      serverTimestamp: new Date(),
      ...metadata
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    // Fail open for analytics
    res.status(200).json({ success: false, error: "Ignored" });
  }
});

analyticsRouter.get('/stats', async (req: Request, res: Response) => {
  try {
    const eventsSnap = await adminDb.collection("analytics_events").get();
    const stats: Record<string, { users: Set<string>, generations: number, shares: number, purchases: number }> = {};
    
    eventsSnap.docs.forEach(doc => {
      const data = doc.data();
      const source = data.source || "unknown";
      
      if (!stats[source]) {
        stats[source] = { users: new Set(), generations: 0, shares: 0, purchases: 0 };
      }
      
      if (data.userId) {
        stats[source].users.add(data.userId);
      }
      
      if (data.event === "generation_completed") {
        stats[source].generations++;
      } else if (data.event === "share_clicked") {
        stats[source].shares++;
      } else if (data.event === "purchase_completed") {
        stats[source].purchases++;
      }
    });

    const result = Object.entries(stats).map(([source, data]) => ({
      source,
      users: data.users.size,
      generations: data.generations,
      shares: data.shares,
      purchases: data.purchases
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});
