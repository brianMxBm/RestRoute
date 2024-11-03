import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  type KeyboardAvoidingViewProps,
} from 'react-native';

export type KeyboardAvoidingComponentProps = {
  children: React.ReactNode;
} & KeyboardAvoidingViewProps;

export const KeyboardAvoidingComponent = (props: KeyboardAvoidingComponentProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={props.keyboardVerticalOffset ?? 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            position: 'absolute',
            height: '100%',
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {props.children}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
