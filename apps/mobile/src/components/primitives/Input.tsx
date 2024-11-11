import { cx } from 'class-variance-authority';
import { forwardRef, type Ref } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { Label } from './Label';

export type InputProps = TextInputProps & {
  errorMessage?: string;
  rightInputIcon?: React.ReactNode;
  leftInputIcon?: React.ReactNode;
  classNameInputContainer?: string;
  classNameInput?: string;
  classNameErrorContainer?: string;
  headerText?: string;
  regexPattern?: RegExp;
  showError?: boolean;
  hasError?: boolean;
  onPressIcon?: () => void;
};

//@SEE: forwardRef is changng in the new architecture.

export const Input = forwardRef((props: InputProps, ref: Ref<TextInput>) => {
  const formatBasedOnPattern = (text: string, regexPattern: RegExp) => {
    return text.replace(regexPattern, ''); //@SEE: This is being a bit slow..
  };

  const onChangeText = (text: string) => {
    let changedText = text;

    if (props.regexPattern) {
      changedText = formatBasedOnPattern(changedText, props.regexPattern);
    }

    props.onChangeText?.(changedText);
  };

  return (
    <View className={props.className}>
      <View
        className={twMerge(
          cx('flex flex-row items-center rounded-md border-2 px-3 py-3 '),
          props.classNameInputContainer
        )}
      >
        {props.leftInputIcon && (
          <TouchableOpacity onPress={props.onPressIcon}>{props.leftInputIcon}</TouchableOpacity>
        )}

        <TextInput
          {...props}
          ref={ref}
          className={props.classNameInput}
          defaultValue={props.defaultValue}
          maxLength={props.maxLength}
          numberOfLines={props.numberOfLines}
          value={props.value}
          cursorColor={props.cursorColor}
          autoCorrect={props.autoCorrect}
          autoComplete={props.autoComplete}
          onChangeText={onChangeText}
        />

        {props.rightInputIcon && (
          <TouchableOpacity onPress={props.onPressIcon}>{props.rightInputIcon}</TouchableOpacity>
        )}
      </View>

      {props.showError && (
        <View className={props.classNameErrorContainer}>
          <Label size={'base'} error={props.hasError}>
            {props.errorMessage}
          </Label>
        </View>
      )}
    </View>
  );
});

Input.displayName = 'Input';
