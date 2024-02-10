import {
  ResourceIdentifier,
  isResourceIdentifierOfType,
  toResourceIdentifierObj,
} from 'movex-core-util';
import LearnActivity from 'apps/chessroulette-web/modules/room/Learn/LearnActivity';
import { Twilio } from 'twilio';
import { IceServerRecord } from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';
import RoomTemplate from 'apps/chessroulette-web/templates/RoomTemplate';
import { config } from 'apps/chessroulette-web/config';
import { getServerSession } from 'next-auth';
import { authOptions } from 'apps/chessroulette-web/services/auth';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN as string;

const twilioClient: any = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const twilio = {
  getIceServers: async (): Promise<IceServerRecord[]> => {
    try {
      if (!config.CAMERA_ON) {
        throw 'camera off - meant to catch!';
      }

      return (await twilioClient.tokens.create()).iceServers;
    } catch {
      // Return the defaults if no connection or other error
      return [
        {
          url: 'stun:stun.ideasip.com',
          urls: 'stun:stun.ideasip.com',
          credential: undefined,
          username: undefined,
        },
      ];
    }
  },
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { rid: string };
  searchParams: Partial<{ theme: string }>;
}) {
  const session = (await getServerSession(authOptions)) || undefined;
  // console.log('params', decodeURIComponent(params.slug));
  // const { rid, slot } = searchParams;

  // If the given "rid" query param isn't an actual rid of type "chat"
  // if (!isRidOfType('chat', rid)) {
  //   return <div>Error - Rid not valid</div>;
  // }

  // console.log('searchParams', searchParams);
  // const twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  // const iceServersResponse = await fetch(`/api/ice-servers`, {
  //   next: { revalidate: 3600 }, // Will revalidate every 1 hour
  // });

  const id = decodeURIComponent(params.rid);

  // if (!isResourceIdentifierOfType('room', slug)) {
  //   return null;
  // }

  // const rid: ResourceIdentifier<'room'> = `room:${
  //   toResourceIdentifierObj(slug).resourceId
  // }`;

  const rid: ResourceIdentifier<'room'> = `room:${id}`;

  // TODO: make it better
  const iceServers = await twilio.getIceServers();

  return (
    <RoomTemplate themeName={searchParams.theme} session={session}>
      <LearnActivity
        rid={rid}
        iceServers={
          iceServers || [
            // DEFAULT
            {
              url: 'stun:stun.ideasip.com',
              urls: 'stun:stun.ideasip.com',
              credential: undefined,
              username: undefined,
            },
          ]
        }
      />
    </RoomTemplate>
  );
}
