import React from 'react';

export type Func<Args extends any[] = any[], ReturnValue = any> = (...args: Args) => ReturnValue;
export type InferProps<T> = T extends React.ComponentType<infer P> ? P : never;
