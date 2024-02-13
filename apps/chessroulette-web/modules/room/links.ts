import { keyInObject, toDictIndexedBy } from '@xmatter/util-kit';
import { useUpdateableSearchParams } from 'apps/chessroulette-web/hooks/useSearchParams';
import { objectKeys } from 'movex-core-util';
import { useRouter, useParams } from 'next/navigation';

type RoomParams = {
  instructor?: boolean;
  edit?: boolean;
  theme?: string;
} & Record<string, string | boolean | number>;

export const links = {
  getRoomLink: (
    {
      id,
      activity,
      instructor,
      edit,
      theme,
      ...params
    }: {
      id: string;
      activity: 'learn'; // Add more
    } & RoomParams,
    nav?: {
      origin: string;
    }
  ) => {
    const searchParams = new URLSearchParams(
      toDictIndexedBy(
        objectKeys(params),
        (key) => String(key),
        (key) => String(params[key])
      )
    );

    if (instructor) {
      searchParams.set('instructor', '1');
    }

    if (edit) {
      searchParams.set('edit', '1');
    }

    if (theme) {
      searchParams.set('theme', theme);
    }

    return `${
      nav?.origin ?? ''
    }/r/${activity}/${id}?${searchParams.toString()}`;
  },
};

export const useCurrentRoomLinks = () => {
  const router = useRouter();
  const searchParams = useUpdateableSearchParams();
  const currentParams = useParams();

  return {
    setForCurrentRoom: (params: RoomParams) => {
      if (
        !(
          keyInObject(currentParams, 'rid') &&
          typeof currentParams.rid === 'string'
        )
      ) {
        throw new Error('UsecurrentRoom: The room Id must be a string');
      }

      const roomId = currentParams.rid;

      const prevParams = searchParams.toObject();

      const link = links.getRoomLink({
        id: roomId,
        activity: 'learn', // this should change
        ...prevParams,
        ...params,
      });

      router.push(link);
    },
  };
};
