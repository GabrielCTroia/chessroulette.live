import React, { useMemo } from 'react';
import { FaceTime, FaceTimeProps } from '../FaceTime';
import { Reel } from './components/Reel';
import { MyFaceTime } from '../MyFaceTime';
import {
  PeerUserId,
  StreamingPeer,
} from 'apps/chessroulette-web/providers/PeerToPeerProvider/type';

type OverlayedNodeRender = (p: { inFocus?: PeerUserId }) => React.ReactNode;

export type Reel = {
  streamingPeers: StreamingPeer[];
  // TODO: Add these back
  myStreamingPeerUserId: StreamingPeer['userId'];
  focusedStreamingPeer: Pick<StreamingPeer, 'connection' | 'userId'>; // TODO: Bring back
};

export type MultiFaceTimeCompactProps = {
  reel?: Reel;

  onFocus: (userId: PeerUserId) => void;

  width?: number;
  containerClassName?: string;

  headerOverlay?: OverlayedNodeRender;
  footerOverlay?: OverlayedNodeRender;
  mainOverlay?: OverlayedNodeRender;
} & Omit<FaceTimeProps, 'streamConfig' | 'footer' | 'header' | 'onFocus'>;

export const MultiFaceTimeCompact: React.FC<MultiFaceTimeCompactProps> = ({
  reel,
  onFocus,

  containerClassName,
  width,
  headerOverlay,
  footerOverlay,
  mainOverlay,

  ...faceTimeProps
}) => {
  // const cls = useStyles();
  const containerStyles = useMemo(() => ({ width: width || '100%' }), [width]);

  const label = useMemo(() => {
    // return 'FIX LABEL';
    if (!reel) {
      return '';
    }

    return reel.focusedStreamingPeer.userId;

    // return reel.focusedStreamingPeer.userId === reel.myStreamingPeerUserId
    //   ? // ? getUserDisplayName(reel.focusedStreamingPeer.user)
    //     reel.focusedStreamingPeer.userId
    //   : '';
  }, [reel]);

  const inFocusUserOverlay = useMemo(
    // () => ({ inFocus: reel?.focusedStreamingPeer.user }),
    () => ({ inFocus: undefined }),
    [reel]
  );

  return (
    <div
      // className={cx(cls.container, containerClassName)}
      className={`relative ${containerClassName}`}
      style={containerStyles}
    >
      {reel ? (
        <FaceTime
          // streamConfig={reel.focusedStreamingPeer.connection.channels.streaming}
          streamConfig={reel.focusedStreamingPeer.connection.channels.streaming}
          label={label}
          labelPosition="bottom-left"
          {...faceTimeProps}
        />
      ) : (
        <MyFaceTime
          {...faceTimeProps}
          label={label}
          labelPosition="bottom-left"
        />
      )}
      <div
        // className={cls.overlayedContainer}
        className="absolute inset-0 flex flex-col"
      >
        <div
          // className={cls.headerWrapper}
          className=""
        >
          {headerOverlay ? headerOverlay(inFocusUserOverlay) : null}
        </div>
        <div className="flex flex-1 min-h-0">
          <div
            // className={cls.mainOverlayWrapper}
            className="flex-1"
          >
            {mainOverlay ? mainOverlay(inFocusUserOverlay) : null}
          </div>
          {reel && (
            <div
              // className={cls.reelWrapper}
              className="flex overflow-auto pr-1 pb-1"
              style={{
                width: '25%',
              }}
            >
              <div
                // className={cls.reelScroller}
                //     minHeight: '100%',
                //     display: 'flex',
                //     flexDirection: 'column-reverse',
                //     flex: 1,
                //     overflowY: 'auto',

                //     // overscroll: auto;
                //     msOverflowStyle: '-ms-autohiding-scrollbar',

                //     '&:hover': {
                //       // overflowY: 'scroll',
                //     },
                className="flex flex-col-reverse flex-1 overflow-y-auto hover:"
              >
                <Reel streamingPeers={reel.streamingPeers} onClick={onFocus} />
              </div>
            </div>
          )}
        </div>
        <div
          // className={cls.footerWrapper}
          className=""
        >
          {footerOverlay ? footerOverlay(inFocusUserOverlay) : null}
        </div>
      </div>
    </div>
  );
};

// const useStyles = createUseStyles({
//   container: {
//     position: 'relative',
//   },
//   reel: {
//     position: 'absolute',
//     bottom: '15px',
//     right: '10px',
//   },
//   smallFacetime: {
//     border: '2px solid rgba(0, 0, 0, .3)',
//   },
//   fullFacetime: {},
//   noFacetime: {
//     background: '#ededed',
//   },
//   title: {
//     background: 'rgba(255, 255, 255, .8)',
//     textAlign: 'center',
//     padding: '5px',
//     borderRadius: '5px',
//   },
//   titleWrapper: {
//     position: 'absolute',
//     top: '20px',
//     left: 0,
//     right: 0,
//     textAlign: 'center',
//   },
//   overlayedContainer: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     right: 0,
//     bottom: 0,

//     display: 'flex',
//     flexDirection: 'column',
//   },
//   headerWrapper: {},
//   footerWrapper: {},
//   mainWrapper: {
//     display: 'flex',
//     flexDirection: 'row',
//     flex: 1,
//     minHeight: 0,
//   },
//   faceTimeAsButton: {
//     cursor: 'pointer',
//   },
//   mainOverlayWrapper: {
//     flex: 1,
//   },
//   reelWrapper: {
//     display: 'flex',
//     flex: '0 1 auto',
//     overflow: 'auto',

//     width: '22.2%',
//     paddingRight: spacers.get(0.7),
//     paddingBottom: spacers.get(0.7),
//   },
//   reelScroller: {
//     minHeight: '100%',
//     display: 'flex',
//     flexDirection: 'column-reverse',
//     flex: 1,
//     overflowY: 'auto',

//     // overscroll: auto;
//     msOverflowStyle: '-ms-autohiding-scrollbar',

//     '&:hover': {
//       // overflowY: 'scroll',
//     },
//   },
//   smallFacetimeWrapper: {
//     marginTop: '8%',
//     ...softBorderRadius,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   smallFacetimeBorder: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     boxShadow: 'inset 0 0 1px 1px white',
//     ...softBorderRadius,
//   },
//   smallFacetimeLabel: {
//     ...fonts.small3,
//   },
// });
