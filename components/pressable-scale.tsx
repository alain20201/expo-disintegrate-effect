import { ComponentProps, ReactNode } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const defaultSpringRelease = {
  stiffness: 300,
  damping: 22,
  mass: 1.5,
  restSpeedThreshold: 0.001,
};

export const defaultSpringPress = {
  ...defaultSpringRelease,
  velocity: -0.5,
};

interface PressableScaleProps extends ComponentProps<typeof Pressable> {
  children: ReactNode;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export const PressableScale = ({
  children,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: PressableScaleProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPressable
      onPressIn={(e: GestureResponderEvent) => {
        "worklet";
        scale.value = withSpring(0.98, defaultSpringPress);
        if (onPressIn) scheduleOnRN(onPressIn, e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        "worklet";
        scale.value = withSpring(1, defaultSpringRelease);
        if (onPressOut) scheduleOnRN(onPressOut, e);
      }}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
};
