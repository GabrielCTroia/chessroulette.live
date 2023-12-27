const SIGNALING_SERVER_CONFIG = {
  // host: 'chessroulette-rtc-signaling.fly.dev',
  // port: 443,
  // secure: true,
  host: process.env.NEXT_PUBLIC_SIGNALING_SERVER_HOST,
  port: Number(process.env.NEXT_PUBLIC_SIGNALING_SERVER_PORT),
  secure: Number(process.env.NEXT_PUBLIC_SIGNALING_SERVER_SECURE) === 1,
  // pingInterval: 30 * 1000,
};

const MOVEX_ENDPOINT_URL = process.env.NEXT_PUBLIC_MOVEX_ENDPOINT_URL as string;

// TODO: This could be changed from
const CAMERA_ON = true;

export const config = {
  SIGNALING_SERVER_CONFIG,
  MOVEX_ENDPOINT_URL,
  CAMERA_ON,
};
