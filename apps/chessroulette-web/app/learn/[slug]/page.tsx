import {
  ResourceIdentifier,
  isResourceIdentifierOfType,
  toResourceIdentifierObj,
} from 'movex-core-util';
import LearnActivity from 'apps/chessroulette-web/modules/room/Learn/LearnActivity';
import Twilio from 'twilio';
import { IceServerRecord } from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN as string;

const twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const twilio = {
  getTokens: async () => twilioClient.tokens.create(),
};

export default async function Page({ params }: { params: { slug: string } }) {
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

  const slug = decodeURIComponent(params.slug);

  if (!isResourceIdentifierOfType('room', slug)) {
    return null;
  }

  const rid: ResourceIdentifier<'room'> = `room:${
    toResourceIdentifierObj(slug).resourceId
  }`;


  // TODO: make it better
  const iceServers = (await twilio.getTokens()).iceServers as IceServerRecord[];

  console.log('iceServers', iceServers);

  return (
    <LearnActivity
      rid={rid}
      playingColor="black"
      fen="rnbqkbnr/pp2pppp/8/3p4/2p1PP2/2P2NP1/PP1P3P/RNBQKB1R w KQkq - 0 1"
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
  );
}
