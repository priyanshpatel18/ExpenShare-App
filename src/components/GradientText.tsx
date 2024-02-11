import MaskedView from '@react-native-masked-view/masked-view';
import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type propsType = {
  text: string;
  style?: any;
}

const GradientText = ({ text, style }: propsType): React.JSX.Element => {
  return (
    <MaskedView maskElement={<Text style={style}>{text}</Text>}>
      <LinearGradient
        colors={['#2faae3', '#c968ff', '#e680b1', '#fb9475']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}>
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
