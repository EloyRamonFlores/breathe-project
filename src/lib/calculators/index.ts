import { calculateRisk, getEraFromYear } from "./asbestos-risk-calculator";

export { calculateRisk, getEraFromYear };

/**
 * Factory function for substance-specific risk calculators.
 * Currently supports "asbestos" only.
 * When adding a new substance (e.g. PFAS), create a new calculator file
 * in this directory and add a case here.
 */
export function getCalculator(substanceId: string) {
  if (substanceId === "asbestos") {
    return { calculateRisk };
  }
  throw new Error(`No calculator found for substance: ${substanceId}`);
}
