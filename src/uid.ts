let counter = 0;

export function uid(): string {
  counter += 1;
  return `t${counter.toString(36)}-${Date.now().toString(36)}`;
}
