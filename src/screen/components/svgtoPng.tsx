// SvgToPng.js
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { SvgXml } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

const decodeSvgBase64 = (base64) => {
  if (!base64) return '';
  return atob(
    base64.replace('data:image/svg+xml;base64,', '')
  );
};

const SvgToPng = forwardRef(({ svgBase64, size = 300 }, ref) => {
  const viewShotRef = useRef();
  const svgXml = decodeSvgBase64(svgBase64);

  useImperativeHandle(ref, () => ({
    convertToPng: async () => {
      if (!viewShotRef.current || !svgXml) return null;

      return await viewShotRef.current.capture({
        format: 'png',
        quality: 1,
      });
    },
  }));

  if (!svgXml) return null;

  return (
    <ViewShot
      ref={viewShotRef}
      options={{ format: 'png', quality: 1 }}
      style={{
        position: 'absolute',
        left: -1000,
        width: size,
        height: size,
      }}
    >
      <SvgXml xml={svgXml} width={size} height={size} />
    </ViewShot>
  );
});

export default SvgToPng;
