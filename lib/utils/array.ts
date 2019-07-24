export function range(length: number): number[]
export function range<P>(length: number, map: (n: number) => P): P[]
export function range<P>(length: number, map?: (n: number) => P): P[] {
  const arr: P[] = []
  let i = 0
  for (; i < length; i += 1) {
    if (map) {
      arr.push(map(i))
    } else {
      ;((arr as any) as number[]).push(i)
    }
  }

  return arr
}
