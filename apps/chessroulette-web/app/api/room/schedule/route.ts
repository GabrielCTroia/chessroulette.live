import { getRandomStr } from 'apps/chessroulette-web/util';
import { Metadata } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

export const metadata: Metadata = {
  title: 'Chessroulette',
};

const paramsSchema = z.object({
  client: z.string(), // Outpost // TODO: this can be used later when they hit the api, now just the op prefixed id
  activity: z.literal('learn'), // This will be more in the future like play or others
  theme: z.string().optional(),
});

export function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.search);
  const result = paramsSchema.safeParse(Object.fromEntries(params));

  if (!result.success) {
    return NextResponse.json(result.error, { status: 400 });
  }

  const { activity, client, ...nextParamsObj } = result.data;

  const nextParams = new URLSearchParams();

  Object.entries(nextParamsObj).forEach(([k, v]) => {
    if (v) {
      nextParams.set(k, String(v));
    }
  });

  const roomId = client.slice(0, 3) + getRandomStr(6);

  // TODO: Here the room can be created on demand via the API
  const baseUrl = `${
    request.nextUrl.origin
  }/r/new?activity=${activity}&id=${roomId}&${nextParams.toString()}`;

  return NextResponse.json({
    links: {
      instructor: `${baseUrl}&instructor=1`,
      student: baseUrl,
    },
  });
}
