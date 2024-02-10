export const links = {
  getRoomLink: (
    {
      id,
      activity,
      instructor,
      ...params
    }: {
      id: string;
      activity: 'learn'; // Add more
      instructor?: '1' | '0';
    } & Record<string, string>,
    nav?: {
      origin: string;
    }
  ) => {
    const searchParams = new URLSearchParams(params);

    if (instructor) {
      searchParams.set('instructor', '1');
    }

    return `${
      nav?.origin ?? ''
    }/r/${activity}/${id}?${searchParams.toString()}`;
  },
};
