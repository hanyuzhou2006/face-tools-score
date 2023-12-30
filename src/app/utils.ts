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
  const indexedFinalss = finals.map((final, i) => [final, i]);
  const sortedFinalss = indexedFinalss.sort((a, b) => b[0] - a[0]);
  const sortedFinals = sortedFinalss.map((val) => val[0]);
  const originalIndex = sortedFinalss.map((val) => val[1]);

  const len = sortedFinals.length;

  const sortedRes = [];
  for (let i = 0; i < len; i++) {
    const final = sortedFinals[i] + delta;
    if (final > 100) {
      sortedRes.push(100);
      delta = final - 100;
    } else {   
      sortedRes.push(final);
      delta = 0;
    }
  }

  const res = [];
  for (let i = 0; i < len; i++) {
    const index = originalIndex[i];
    res[index] = sortedRes[i];
  }
  return [res, delta / len];
}

export function expectScore(
  expect: number,
  performance: Row[],
  service: Row[]
) {
  const finalPerformance = [];
  for (let i = 0; i < performance.length; i++) {
    const [self, upper] = performance[i];
    const final = getFinalScore(expect, self, upper);
    finalPerformance.push(final);
  }
  const [formattedFinalPerformance, remainPerformance] =
    formatFinals(finalPerformance);

  const finalService = [];
  const delta = remainPerformance / service.length;
  for (let i = 0; i < service.length; i++) {
    const [self, upper] = service[i];
    const final = getFinalScore(expect, self, upper) + delta;
    finalService.push(final);
  }
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
