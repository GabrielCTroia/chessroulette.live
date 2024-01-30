'use client';

// import { getRandomInt } from 'chessterrain-react';
// import { getRandomInt } from '@xmatter/util-kit';
import { useSearchParams } from 'next/navigation';
import { defaultTheme, themes } from './defaultTheme';
import { isOneOf } from '@xmatter/util-kit';
import { objectKeys } from 'movex-core-util';

export const useTheme = () => {
  // TODO: This is just temporary as the user ids are passed in the url
  const params = useSearchParams();

  // const foundNeededTheme =
  const themeParam = params.get('theme') || '';

  const baseTheme = {
    ...defaultTheme,
    ...(isOneOf(themeParam, objectKeys(themes)) && themes[themeParam]),
  };

  const darkSquare = params.get('darkSquare') || undefined;
  const lightSquare = params.get('lightSquare') || undefined;
  const hoveredSquare = params.get('hoveredSquare') || undefined;

  // TODO: Validate colors

  return {
    ...baseTheme,
    board: {
      ...baseTheme.board,
      ...(darkSquare && { darkSquare }),
      ...(lightSquare && { lightSquare }),
      ...(hoveredSquare && { hoveredSquare }),
    },
  };
};
