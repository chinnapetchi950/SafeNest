import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const QRCodeSVG = ({ svgBase64 }) => {
  const svgXml = atob(
    svgBase64.replace('data:image/svg+xml;base64,', '')
  );

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center',backgroundColor:'#fff',marginTop:10 }}>
      <SvgXml xml={svgXml} width={60} height={60} />
    </View>
  );
};

export default QRCodeSVG;
