export function nilThrows<T>(
  value: NonNullable<T> | null | undefined,
): NonNullable<T> {
  if (value == null) {
    throw new TypeError("Invariant violation: Value can't be null");
  }
  return value;
}
