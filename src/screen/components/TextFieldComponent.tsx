import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  I18nManager,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import globalstyles from '../../styles/globalstyles';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../styles/colors';

// Support RTL text direction
I18nManager.allowRTL(true);

interface CustomTextFieldProps extends TextInputProps {
  label?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  onPrefixPress?: () => void;
  onSuffixPress?: () => void;
  readonly?: boolean;
  isPassword?: boolean;
  showPasswordToggle?: boolean;
  /** 👇 NEW: optional error message */
  error?: string;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  prefixIcon,
  suffixIcon,
  onPrefixPress,
  onSuffixPress,
  readonly = false,
  isPassword = false,
  showPasswordToggle = false,
  error,
  ...textInputProps
}) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={[globalstyles.semibold_black, styles.label]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          readonly && { backgroundColor: "#f5f5f5" },
          error && { borderColor: "#FF6B6B" }, // 🔴 Highlight border if error
        ]}
      >
        {/* Prefix icon */}
        {prefixIcon &&
          (onPrefixPress ? (
            <TouchableOpacity onPress={onPrefixPress}>
              <Ionicons
                name={prefixIcon}
                size={20}
                color="#808080"
                style={styles.iconLeft}
              />
            </TouchableOpacity>
          ) : (
            <Ionicons
              name={prefixIcon}
              size={20}
              color="#808080"
              style={styles.iconLeft}
            />
          ))}

        {/* Input */}
        <TextInput
          style={[styles.input]}
          placeholderTextColor="#999"
          editable={!readonly}
          secureTextEntry={isSecure}
          textAlign="right"
          {...textInputProps}
        />

        {/* Password toggle or suffix icon */}
        {isPassword && showPasswordToggle ? (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        ) : (
          suffixIcon && (
            <TouchableOpacity onPress={onSuffixPress}>
              <Ionicons
                name={suffixIcon}
                size={20}
                color="#666"
                style={styles.iconRight}
              />
            </TouchableOpacity>
          )
        )}
      </View>

      {/* 👇 Error Message (only if error exists) */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

export default CustomTextField;



const styles = StyleSheet.create({
    
  label: {
    marginBottom: 6,
   textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'flex-end',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 14,
    color: "#000",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  container: {
    width: '100%',
    marginBottom: 20,
    justifyContent:'flex-end',
    marginLeft:0
  },
  label1: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 6,
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#D9D9D9',
    borderRadius: 25,
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 14,
  },
  input1: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    textAlign: 'right',
    paddingVertical: 0,
  },
  iconLeft1: {
    marginRight: 8,
  },
  iconRight1: {
    marginLeft: 8,
  },
    buttonWrapper: {
    width: "100%",
    alignItems: "center",
    color:colors.primary
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});




export const CommonButton = ({
  title = "Next",
  onPress,
  colors = ["#A594F9", "#C3B9FF"],
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.buttonWrapper, style]}
    >
      <LinearGradient colors={colors} style={styles.button}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};


