import { describe, it, expect } from "vitest";
import type { DepartmentResult, Opportunity } from "./types";

describe("types", () => {
  it("constructs a DepartmentResult", () => {
    const d: DepartmentResult = {
      id: "market",
      department: "Market Department",
      shortName: "Market",
      agent: "Market Agent",
      question: "Is there demand?",
      status: "complete",
      keyFinding: "Visible demand.",
      score: 82,
      evidence: ["a", "b"],
      outputPreview: [{ label: "market_heat", value: "medium-high" }],
      mission: "Judge demand.",
      inputUsed: ["keyword"],
      reasoning: "Searched Shopee.",
      warnings: [],
      impactOnCommittee: "Raises confidence.",
    };
    expect(d.score).toBe(82);
  });

  it("constructs an Opportunity with a valid decision", () => {
    const o: Opportunity = {
      id: "p1",
      productName: "Mini Desk Vacuum",
      productDirection: "Office",
      sourcePrice: "SGD 3.80",
      suggestedSellingPrice: "SGD 14.90",
      grossMargin: "60%",
      netProfit: "SGD 4.60",
      netMargin: "31%",
      availableStock: "In stock",
      fulfillmentTime: "10-14 days",
      marketHeat: "Medium-high",
      riskLevel: "Low",
      confidenceScore: 82,
      decision: "go",
      keyReason: "Clear scenario.",
    };
    expect(["go", "watch", "reject"]).toContain(o.decision);
  });
});
