// borrowed from https://stackoverflow.com/questions/66641743/typescript-json-path-type
// (with modification for ValidLeafPaths)

// helper types
type Length<T> = T extends { length: infer L } ? L : never

type PopFront<T extends unknown[]> = T extends [infer U, ...infer R] ? U : never
type Shift<T extends unknown[]> = T extends [infer U, ...infer R] ? R : never

type Filter<T extends unknown[], U> = T extends []
  ? []
  : T extends [infer F, ...infer R]
  ? F extends U
    ? Filter<R, T>
    : [F, ...Filter<R, U>]
  : never
type TupleIncludes<T extends unknown[], U> = Length<
  Filter<T, U>
> extends Length<T>
  ? false
  : true
type StringIncludes<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}` ? true : false

type Includes<T extends unknown[] | string, U> = T extends unknown[]
  ? TupleIncludes<T, U>
  : T extends string
  ? U extends string
    ? StringIncludes<T, U>
    : never
  : never
type Join<T extends unknown[], D extends string> = T extends string[]
  ? PopFront<T> extends string
    ? Length<T> extends 1
      ? `${PopFront<T>}`
      : `${PopFront<T>}${D}${Join<Shift<T>, D>}`
    : never
  : never
type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S]

// return type deduction from path
type NestedType<T, P extends string> = Includes<P, '.'> extends true
  ? PopFront<Split<P, '.'>> extends keyof T
    ? NestedType<T[PopFront<Split<P, '.'>>], Join<Shift<Split<P, '.'>>, '.'>>
    : never
  : P extends keyof T
  ? T[P]
  : never

/**
 * Extracts all valid paths from a JSON object.
 */
export type ValidPaths<T> = keyof T extends never
  ? never
  : {
      [K in keyof T]: T[K] extends never
        ? never
        : T[K] extends Record<string | number | symbol, unknown>
        ? K extends string
          ? `${K}.${ValidPaths<T[K]>}` | K
          : never
        : K
    }[keyof T]

/**
 * Extracts all valid 'leaf' paths from a JSON object (e.g. ones that don't have any child objects, only string/number values)
 */
export type ValidLeafPaths<T> = keyof T extends never
  ? never
  : {
      [K in keyof T]: T[K] extends never
        ? never
        : T[K] extends Record<string | number | symbol, unknown>
        ? K extends string
          ? `${K}.${ValidLeafPaths<T[K]>}`
          : never
        : K
    }[keyof T]
