import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useObjectUrl } from '../../shared/hooks/useObjectUrl';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_ZOOM = 2;
const DOUBLE_TAP_MAX_DELAY_MS = 300;
const TAP_MAX_MOVEMENT_PX = 10;

interface Point {
  x: number;
  y: number;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Hand-rolled pinch-zoom/pan via the Pointer Events API rather than a
// dependency — the gesture surface here is small (one image, one modal) and
// doesn't justify pulling in a zoom/pan library for a personal app.
function LightboxImage({ photo, onClose }: { photo: Blob; onClose: () => void }) {
  const url = useObjectUrl(photo);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const [isGesturing, setIsGesturing] = useState(false);

  const pointers = useRef<Map<number, Point>>(new Map());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const panStart = useRef<{ pointer: Point; translate: Point } | null>(null);
  const tapStart = useRef<Point | null>(null);
  const lastTapAt = useRef(0);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    // Pointer capture keeps move/up events firing on this element even if a
    // finger drifts outside it mid-gesture. It's a nice-to-have, not load-
    // bearing for the gesture math below, so a failure here (browser/WebView
    // quirks) shouldn't abort the rest of the handler.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore — gesture tracking continues without capture
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsGesturing(true);

    if (pointers.current.size === 1) {
      tapStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { pointer: { x: e.clientX, y: e.clientY }, translate };
    } else if (pointers.current.size === 2) {
      tapStart.current = null;
      const [p1, p2] = Array.from(pointers.current.values());
      pinchStart.current = { distance: distance(p1, p2), scale };
    }
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) {
      return;
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [p1, p2] = Array.from(pointers.current.values());
      const ratio = distance(p1, p2) / pinchStart.current.distance;
      setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStart.current.scale * ratio)));
    } else if (pointers.current.size === 1 && panStart.current && scale > MIN_SCALE) {
      const dx = e.clientX - panStart.current.pointer.x;
      const dy = e.clientY - panStart.current.pointer.y;
      setTranslate({ x: panStart.current.translate.x + dx, y: panStart.current.translate.y + dy });
    }
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const wasTap =
      pointers.current.size === 1 &&
      tapStart.current !== null &&
      distance(tapStart.current, { x: e.clientX, y: e.clientY }) < TAP_MAX_MOVEMENT_PX;

    pointers.current.delete(e.pointerId);
    pinchStart.current = null;
    panStart.current = null;

    if (pointers.current.size === 0) {
      setIsGesturing(false);

      if (scale < MIN_SCALE + 0.05) {
        setScale(MIN_SCALE);
        setTranslate({ x: 0, y: 0 });
      }

      if (wasTap) {
        const now = Date.now();
        if (now - lastTapAt.current < DOUBLE_TAP_MAX_DELAY_MS) {
          if (scale > MIN_SCALE) {
            setScale(MIN_SCALE);
            setTranslate({ x: 0, y: 0 });
          } else {
            setScale(DOUBLE_TAP_ZOOM);
          }
          lastTapAt.current = 0;
        } else {
          lastTapAt.current = now;
        }
      }
    }
  }

  return (
    <div
      style={{
        height: '100%',
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <IonButton
        fill="clear"
        color="light"
        onClick={onClose}
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        aria-label="Zavřít"
      >
        <IonIcon slot="icon-only" icon={close} />
      </IonButton>
      {url && (
        <img
          src={url}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            userSelect: 'none',
            transform: `translate(-50%, -50%) translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: isGesturing ? 'none' : 'transform 0.15s ease-out',
          }}
        />
      )}
    </div>
  );
}

interface PhotoLightboxProps {
  photo: Blob | null;
  onClose: () => void;
}

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  return (
    <IonModal isOpen={photo !== null} onDidDismiss={onClose}>
      {/* Mounting LightboxImage only while a photo is set means its zoom/pan
          state starts fresh every time it opens, with no reset effect needed. */}
      {photo && <LightboxImage photo={photo} onClose={onClose} />}
    </IonModal>
  );
}
