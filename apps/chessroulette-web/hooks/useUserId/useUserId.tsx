// import { getRandomInt } from 'chessterrain-react';
import { getRandomInt } from '@xmatter/util-kit';
import { useSearchParams } from 'next/navigation';

export const useUserId = () => {
  // TODO: This is just temporary as the user ids are passed in the url
  const params = useSearchParams();

  return params.get('userId') || `guest-${getRandomInt(0, 1000)}`;
};
