const selfProportion = 0.2;
const upperProportion = 0.3;
const finalProportion = 0.5;

const performanceProportion = 0.7;
const serviceProportion = 0.3;

type Row = [number, number, number];

export function transRows(rows: string[][]): Row[] {
  const len = rows.length;
  const res: Row[] = [];
  for (let i = 0; i < len; i++) {
    const row = rows[i];
    const [self, upper, final] = row;
    res.push([Number(self), Number(upper), Number(final)]);
  }
  return res;
}

function getRowsScore(rows: number[][]) {
  let score = 0;
  const len = rows.length;
  if (len === 0) return 0;
  for (let i = 0; i < len; i++) {
    const row = rows[i];
    const [self, upper, final] = row;
    const selfScore = selfProportion * self;
    const upperScore = upperProportion * upper;
    const finalScore = finalProportion * final;
    score += selfScore + upperScore + finalScore;
  }
  return score / len;
}

export function getScore(performance: string[][], service: string[][]) {
  const performanceScore = getRowsScore(transRows(performance));
  const serviceScore = getRowsScore(transRows(service));

  const score =
    performanceProportion * performanceScore + serviceProportion * serviceScore;
  return score;
}

function formatFinals(finals: number[], delta = 0): [number[], number] {
  const len = finals.length;
  if (len === 0) return [[], 0];
  
  // Add delta to all scores
  const adjustedFinals = finals.map(f => f + delta);
  
  // Identify scores that exceed 100 and those that don't
  let overflow = 0;
  const capped = adjustedFinals.map(f => {
    if (f > 100) {
      overflow += (f - 100);
      return 100;
    }
    return f;
  });
  
  // If there's overflow, redistribute it proportionally to scores with headroom
  if (overflow > 0) {
    const headrooms = capped.map(f => Math.max(0, 100 - f));
    const totalHeadroom = headrooms.reduce((sum, h) => sum + h, 0);
    
    if (totalHeadroom > 0) {
      // Redistribute overflow proportionally based on available headroom
      const redistributed = capped.map((f, i) => {
        if (headrooms[i] > 0) {
          const share = (headrooms[i] / totalHeadroom) * Math.min(overflow, totalHeadroom);
          return Math.min(100, f + share);
        }
        return f;
      });
      
      // Calculate remaining overflow after redistribution
      const newTotal = redistributed.reduce((sum, f) => sum + f, 0);
      const expectedTotal = adjustedFinals.reduce((sum, f) => sum + Math.min(f, 100), 0);
      const remainingOverflow = Math.max(0, adjustedFinals.reduce((sum, f) => sum + f, 0) - newTotal);
      
      return [redistributed, remainingOverflow / len];
    }
  }
  
  return [capped, 0];
}

export function expectScore(
  expect: number,
  performance: Row[],
  service: Row[]
) {
  // Calculate current weighted scores without manager input
  let currentPerformanceSum = 0;
  for (let i = 0; i < performance.length; i++) {
    const [self, upper] = performance[i];
    currentPerformanceSum += selfProportion * self + upperProportion * upper;
  }
  const currentPerformanceAvg = performance.length > 0 ? currentPerformanceSum / performance.length : 0;
  
  let currentServiceSum = 0;
  for (let i = 0; i < service.length; i++) {
    const [self, upper] = service[i];
    currentServiceSum += selfProportion * self + upperProportion * upper;
  }
  const currentServiceAvg = service.length > 0 ? currentServiceSum / service.length : 0;
  
  // Current total weighted score without manager input
  const currentWeightedScore = performanceProportion * currentPerformanceAvg + serviceProportion * currentServiceAvg;
  
  // Calculate how much the manager scores need to contribute
  // Since manager column has weight 0.5, and the contribution is applied to the weighted average:
  // targetWeighted = currentWeighted + 0.5 * managerScore (for all rows equally)
  // Therefore: managerScore = (expect - currentWeighted) / 0.5
  const baseManagerScore = (expect - currentWeightedScore) / finalProportion;
  
  // Apply the same base manager score to all rows
  const finalPerformance = performance.map(() => baseManagerScore);
  const finalService = service.map(() => baseManagerScore);
  
  // Format performance scores and handle overflow
  const [formattedFinalPerformance, remainPerformance] =
    formatFinals(finalPerformance);
  
  // Distribute performance remainder to service scores proportionally
  if (remainPerformance > 0 && service.length > 0) {
    const serviceWithRemainder = finalService.map(f => 
      f + (remainPerformance * performanceProportion / serviceProportion)
    );
    
    // Format service scores and handle overflow
    const [formattedFinalService, remainService] = 
      formatFinals(serviceWithRemainder);
    
    // If there's still remainder from service, redistribute back to performance proportionally
    if (remainService > 0) {
      const performanceHeadrooms = formattedFinalPerformance.map(f => Math.max(0, 100 - f));
      const totalHeadroom = performanceHeadrooms.reduce((sum, h) => sum + h, 0);
      
      if (totalHeadroom > 0) {
        const redistributedPerformance = formattedFinalPerformance.map((f, i) => {
          if (performanceHeadrooms[i] > 0) {
            const share = (performanceHeadrooms[i] / totalHeadroom) * remainService * (serviceProportion / performanceProportion);
            return Math.min(100, f + share);
          }
          return f;
        });
        return [redistributedPerformance, formattedFinalService];
      }
    }
    
    return [formattedFinalPerformance, formattedFinalService];
  }
  
  // Format service scores without remainder
  const [formattedFinalService] = formatFinals(finalService);
  return [formattedFinalPerformance, formattedFinalService];
}

function getFinalScore(expect: number, self: number, upper: number) {
  const selfScore = selfProportion * self;
  const upperScore = upperProportion * upper;
  return (expect - selfScore - upperScore) / finalProportion;
}

export function combineFinal(ori: string[][], combine: number[]): string[][] {
  const len = ori.length;
  const res = [];
  for (let i = 0; i < len; i++) {
    const [self, upper] = ori[i];
    const final = combine[i].toFixed(2);
    res.push([self, upper, final]);
  }
  return res;
}
