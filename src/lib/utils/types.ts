/**
 * If given an object's `typeof`, turns it into an enum-like type.
 * e.g.
 *```typescript
 * const LogLevel = {
 *   DEBUG: "DEBUG",
 *   WARNING: "WARNING",
 *   ERROR: "ERROR",
 * }
 * type LogLevel = Enumify<typeof LogLevel>;
 * ```
 * Which is a better way (imo) of declaring a typescript enum.
 */
export type Enumify<T> = T[keyof T];
