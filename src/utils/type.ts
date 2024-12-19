type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

/* eslint-disable @typescript-eslint/ban-types */
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type WithoutFunctions<T> = Omit<T, FunctionPropertyNames<T>>;

export function getKeys<T extends object>() {
  return <K extends keyof T>(keys: K[]) => keys;
}

export type { WithSelectors, WithoutFunctions };
