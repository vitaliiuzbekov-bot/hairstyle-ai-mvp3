import { checkAndDeductGeneration } from "./src/server/utils/billing.ts";
// wait, checkAndDeductGeneration requires adminDb which fails due to permissions.
// Let's modify billing.ts temporarily to log why it fails?
