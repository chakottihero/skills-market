import Stripe from "stripe";

// Use || (not ??) so empty string also falls back to placeholder
const key = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(key, {
  apiVersion: "2026-04-22.dahlia",
});
