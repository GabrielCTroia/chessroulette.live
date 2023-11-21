'use client';

import {
  ChessTerrain,
  ChessBoard,
  FENToChessBoard,
  chessBoardToPieceLayout,
} from 'chessterrain-react';
import { Chess } from 'chess.js';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { CSSProperties } from 'react';
const chess = new Chess();

export type ChessPropsProps = {
  // sizePx: number;
  style?: CSSProperties;
};

export const CameraView = (props: ChessPropsProps) => {
  return (
    <JitsiMeeting
      roomName="chessroulette-play-1"
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = '700px';
      }}
      configOverwrite={{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        // startScreenSharing: true,
        enableEmailInStats: false,
      }}
      userInfo={{
        displayName: 'gabe',
        email: 'my@emil.com'
      }}
      interfaceConfigOverwrite={{
        APP_NAME: 'Chessroulette',
        DISPLAY_WELCOME_FOOTER: false,
        SHOW_BRAND_WATERMARK: true,
        SHOW_POWERED_BY: true,
        VIDEO_LAYOUT_FIT: 'height',
        GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
      }}
      onApiReady={(api) => {
        // api.emit('')
        console.log('sd', api.getMaxListeners());

        setTimeout(() => {
          // api.executeCommand('toggleWhiteboard');
          // api.executeCommand('showNotification', {
          //   title: 'notify ', // Title of the notification.
          //   description: 'this is the desc', // Content of the notification.
          //   // uid: String, // Optional. Unique identifier for the notification.
          //   // type: String, // Optional. Can be 'info', 'normal', 'success', 'warning' or 'error'. Defaults to 'normal'.
          //   // timeout: String, // optional. Can be 'short', 'medium', 'long', or 'sticky'. Defaults to 'short'.
          // });
        }, 2 * 1000);
      }}
    />
  );
};
