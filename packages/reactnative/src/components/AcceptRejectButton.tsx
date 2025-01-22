import React from "react";
import { StyleSheet } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";

interface IAcceptRejectButtonProps {
  accept: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onPress: () => void;
}

export function AcceptRejectButton({
  accept,
  disabled,
  isLoading,
  onPress,
}: IAcceptRejectButtonProps) {
  const buttonMode = "contained";
  const buttonColor = accept ? "#2BEE6C" : "#F25A67";
  const buttonText = accept ? "Accept" : "Decline";

  return (
    <Button
      mode={buttonMode}
      style={[styles.buttonContainer, !accept && styles.accept]}
      onPress={onPress}
      disabled={disabled}
      loading={isLoading}
      buttonColor={buttonColor}
      labelStyle={styles.mainText}
    >
      {buttonText}
    </Button>
  );
}

const styles = StyleSheet.create({
  accept: {
    marginRight: 20,
  },
  buttonContainer: {
    marginVertical: 16,
    borderRadius: 20,
    height: 56,
    width: 160,
  },
  mainText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600",
  },
  imageContainer: {
    width: 24,
    height: 24,
  },
});
