export function generateReferenceNumber() {
  const suffix = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `27${suffix}`;
}
