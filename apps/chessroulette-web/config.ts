const SIGNALING_SERVER_CONFIG = {
  host: 'chessroulette-rtc-signaling.fly.dev',
  port: 443,
  secure: true,
  // host: process.env.NEXT_APP_SIGNALING_HOST,
  // port: Number(process.env.REACT_APP_SIGNALING_PORT),
  // secure: Number(process.env.REACT_APP_SIGNALING_SECURE) === 1,
  // pingInterval: 30 * 1000,
};

export const config = {
  SIGNALING_SERVER_CONFIG,
};
