export async function ensureMinDelay(
  startTime: number,
  minDelay = 400
) {
  const elapsed = Date.now() - startTime;

  if (elapsed < minDelay) {
    await new Promise((res) => setTimeout(res, minDelay - elapsed));
  }
}
