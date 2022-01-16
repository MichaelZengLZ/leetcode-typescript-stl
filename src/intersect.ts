export function intersect(num1: number[], num2: number[]): boolean {
  const set = new Set(num1);
  for (const stop of num2) {
    if (set.has(stop)) {
      return true;
    }
  }
  return false;
}
