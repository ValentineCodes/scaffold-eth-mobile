import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Modal, Portal, Text, IconButton } from "react-native-paper";
import { COLORS } from "../../utils/constants";
import { FONT_SIZE } from "../../utils/styles";
import Button from "../Button";

type Props = {
  isVisible: boolean;
  icon?: JSX.Element;
  title: string;
  subTitle: string;
  okText?: string;
  cancelText?: string;
  isOkLoading?: boolean;
  isCancelLoading?: boolean;
  onAccept: () => void;
  onClose: () => void;
};

export default function ConsentModal({
  isVisible,
  icon,
  title,
  subTitle,
  okText,
  cancelText,
  isOkLoading,
  isCancelLoading,
  onAccept,
  onClose,
}: Props) {
  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          {icon || (
            <IconButton
              icon="alert"
              size={Dimensions.get("window").height * 0.17}
              iconColor={COLORS.primary}
            />
          )}
          <Text variant="headlineMedium" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {subTitle}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              type="outline"
              text={cancelText || "Cancel"}
              onPress={onClose}
              loading={isCancelLoading}
              style={styles.button}
            />
            <Button
              text={okText || "Ok"}
              onPress={onAccept}
              loading={isOkLoading}
              style={styles.button}
            />
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 28,
    margin: 20,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    color: COLORS.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 16,
    width: "100%",
  },
  button: {
    flex: 1,
  },
});
