import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

const db = new Database("app.db");

// Initialize tables for demo
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    email TEXT UNIQUE, 
    role TEXT CHECK(role IN ('candidate', 'recruiter', 'affiliate')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS affiliate_referrals (referrer_id INTEGER, referred_user_id INTEGER);
  CREATE TABLE IF NOT EXISTS affiliate_wallets (user_id INTEGER PRIMARY KEY, balance_jpy INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS subscriptions (user_id INTEGER PRIMARY KEY, status TEXT, plan_type TEXT);
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Step 2: Payment Webhook Logic ---
  app.post("/api/webhooks/stripe", (req, res) => {
    const event = req.body;

    // In production, verify Stripe signature here
    if (event.type === "invoice.payment_succeeded") {
      const { customer_email, amount_paid, metadata } = event.data.object;
      const userId = metadata.userId; // Passed during checkout session creation

      console.log(`Processing payment for User ${userId}: ${amount_paid} JPY`);

      try {
        // 1. Update/Renew User Subscription
        db.prepare("INSERT OR REPLACE INTO subscriptions (user_id, status, plan_type) VALUES (?, 'active', ?)")
          .run(userId, metadata.planType);

        // 2. Check for Referrer (Lifetime Tracking)
        const referral = db.prepare("SELECT referrer_id FROM affiliate_referrals WHERE referred_user_id = ?")
          .get(userId) as { referrer_id: number } | undefined;

        if (referral) {
          const commission = Math.floor(amount_paid * 0.30); // 30% Revenue Share
          
          // 3. Credit Referrer's Wallet
          db.prepare(`
            INSERT INTO affiliate_wallets (user_id, balance_jpy) 
            VALUES (?, ?) 
            ON CONFLICT(user_id) DO UPDATE SET balance_jpy = balance_jpy + ?
          `).run(referral.referrer_id, commission, commission);

          console.log(`Affiliate ${referral.referrer_id} credited with ${commission} JPY commission.`);
        }

        return res.json({ received: true, processed: true });
      } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(500).json({ error: "Internal processing error" });
      }
    }

    res.json({ received: true });
  });

  // Mock API for Job Board (for Step 3)
  app.get("/api/jobs", (req, res) => {
    const jobs = [
      { id: 1, title: "Construction Worker", location: "Tokyo", salary: "250,000 JPY", type: "Ikusei Shūurō" },
      { id: 2, title: "Food Processing", location: "Osaka", salary: "220,000 JPY", type: "Tokutei Ginou" },
      { id: 3, title: "Care Worker", location: "Nagoya", salary: "235,000 JPY", type: "Ikusei Shūurō" },
      { id: 4, title: "Agricultural Labor", location: "Hokkaido", salary: "210,000 JPY", type: "Tokutei Ginou" },
    ];
    res.json(jobs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
