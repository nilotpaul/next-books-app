export default async function wait(ms: number = 1000) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
