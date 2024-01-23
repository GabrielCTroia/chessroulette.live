import { invoke, objectKeys, toDictIndexedBy } from '@xmatter/util-kit';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export type SearchParamsRecord = Record<string, string | number | undefined>;

export const useUpdateableSearchParams = () => {
  const currentSearchParams = useSearchParams();

  return useMemo(
    () => ({
      set: (
        nextSearchParams?:
          | SearchParamsRecord
          | ((prev: SearchParamsRecord) => SearchParamsRecord)
      ) => {
        const searchParams = new URLSearchParams(
          currentSearchParams.toString()
        );

        const next = invoke(() => {
          if (typeof nextSearchParams === 'function') {
            const prev = toDictIndexedBy(
              Array.from(currentSearchParams.entries()),
              ([key]) => key,
              ([, val]) => val
            );

            return nextSearchParams(prev);
          }

          return nextSearchParams || {};
        });

        objectKeys(next).forEach((key) => {
          const nextVal = next[key];

          if (nextVal) {
            searchParams.set(key, String(next[key]));
          } else {
            searchParams.delete(key);
          }
        });

        return searchParams.toString();
      },
    }),
    [currentSearchParams]
  );
};
