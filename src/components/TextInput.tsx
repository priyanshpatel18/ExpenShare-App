import React, { useRef } from 'react';
import { Image, KeyboardTypeOptions, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';

type propsType = {
  imageUrl: any;
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string>>
  keyboardType: KeyboardTypeOptions
  placeholder: string
  secureTextEntry: boolean
}

export default function Input({ value, setValue, imageUrl, keyboardType, placeholder, secureTextEntry }: propsType): React.JSX.Element {
  const inputRef = useRef<TextInput>(null);

  function handleChange(text: string) {
    setValue(text)
  }

  function handleContainerPress() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <View style={styles.inputContainer}>
        <Image
          style={styles.inputIcon}
          source={imageUrl}
        />
        <TextInput
          ref={inputRef}
          style={styles.inputStyle}
          value={value}
          keyboardType={keyboardType}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#dfdfdf",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  inputStyle: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 18,
    color: "#222"
  },
  inputIcon: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
  },
})