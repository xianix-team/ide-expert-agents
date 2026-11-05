// USD per million tokens, first-party API rates as of 2026-10-06. Update this
// table when prices change or models launch; a model missing from it still
// reports tokens but omits costUsd.
interface Price {
  input: number;
  output: number;
  cacheRead?: number; // Defaults to 0.1 × input.
}

const PRICES: Record<string, Price> = {
  "claude-fable-5-1": { input: 10, output: 50, cacheRead: 0.25 },
  "claude-mythos-5-1": { input: 10, output: 50, cacheRead: 0.25 },
  "claude-fable-5": { input: 10, output: 50 },
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2 },
  "claude-opus-5": { input: 5, output: 25 },
  "claude-opus-4-8": { input: 5, output: 25 },
  "claude-opus-4-7": { input: 5, output: 25 },
  "claude-opus-4-6": { input: 5, output: 25 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2 },
  "claude-sonnet-5": { input: 2, output: 10 },
  "claude-sonnet-4-6": { input: 3, output: 15 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
  "claude-haiku-4-5": { input: 1, output: 5 },
};

const CACHE_WRITE_5M_MULTIPLIER = 1.25;
const CACHE_WRITE_1H_MULTIPLIER = 2;

export interface Usage {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  cache_creation?: { ephemeral_1h_input_tokens?: number };
}

// Model ids can carry a provider prefix or suffix, so take the longest known id
// they contain: "claude-opus-5-5[1m]" must not match "claude-opus-5".
function findPrice(model: string): Price | undefined {
  const key = Object.keys(PRICES)
    .filter(id => model.includes(id))
    .sort((a, b) => b.length - a.length)[0];
  return key ? PRICES[key] : undefined;
}

export function estimateCostUsd(model: string, usage: Usage): number | undefined {
  const price = findPrice(model);
  if (!price) return undefined;

  // Claude Code writes mostly 1-hour cache entries, which cost more than 5-minute ones.
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const cacheWrite1h = usage.cache_creation?.ephemeral_1h_input_tokens ?? 0;

  const perMillion =
    (usage.input_tokens ?? 0) * price.input +
    (usage.output_tokens ?? 0) * price.output +
    (cacheWrite - cacheWrite1h) * price.input * CACHE_WRITE_5M_MULTIPLIER +
    cacheWrite1h * price.input * CACHE_WRITE_1H_MULTIPLIER +
    (usage.cache_read_input_tokens ?? 0) * (price.cacheRead ?? price.input * 0.1);

  return perMillion / 1_000_000;
}
