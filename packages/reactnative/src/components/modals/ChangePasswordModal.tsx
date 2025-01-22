import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { WINDOW_WIDTH } from "../../utils/styles";
import PasswordInput from "../forms/PasswordInput";
import Button from "../Button";
import { generate } from "random-words";
import { useToast } from "react-native-toast-notifications";
import { useSecureStorage } from "../../hooks/useSecureStorage";

type Props = {
  modal: {
    closeModal: () => void;
  };
};

export default function ChangePasswordModal({ modal: { closeModal } }: Props) {
  const toast = useToast();
  const { saveItem, getItem } = useSecureStorage();

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [suggestion, setSuggestion] = useState("");

  const change = async () => {
    try {
      const security = await getItem("security");

      if (!password.current || !password.new || !password.confirm) {
        toast.show("Password cannot be empty!", { type: "danger" });
        return;
      }

      if (password.new.length < 8) {
        toast.show("Password must be at least 8 characters", { type: "danger" });
        return;
      }

      if (password.current.trim() !== security.password) {
        toast.show("Incorrect password!", { type: "danger" });
        return;
      }

      if (password.current.trim() === password.new.trim()) {
        toast.show("Cannot use current password");
        return;
      }

      if (password.new.trim() !== password.confirm.trim()) {
        toast.show("Passwords do not match!", { type: "danger" });
        return;
      }

      await saveItem(
        "security",
        JSON.stringify({ ...security, password: password.new.trim() }),
      );

      closeModal();
      toast.show("Password Changed Successfully", { type: "success" });
    } catch (error) {
      toast.show("Failed to change password", { type: "danger" });
    }
  };

  useEffect(() => {
    setSuggestion(
      generate({ exactly: 2, join: "", minLength: 4, maxLength: 5 }),
    );
  }, []);

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={closeModal}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <PasswordInput
            label="Current Password"
            value={password.current}
            infoText={password.current.length < 8 && "Must be at least 8 characters"}
            onChange={(value) =>
              setPassword((prev) => ({ ...prev, current: value }))
            }
          />
          <PasswordInput
            label="New Password"
            value={password.new}
            suggestion={suggestion}
            infoText={password.new.length < 8 && "Must be at least 8 characters"}
            onChange={(value) =>
              setPassword((prev) => ({ ...prev, new: value }))
            }
          />
          <PasswordInput
            label="Confirm Password"
            value={password.confirm}
            suggestion={suggestion}
            infoText={password.confirm.length < 8 && "Must be at least 8 characters"}
            onChange={(value) =>
              setPassword((prev) => ({ ...prev, confirm: value }))
            }
          />

          <Button
            text="Change Password"
            onPress={change}
            style={styles.button}
          />
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    margin: 20,
    width: WINDOW_WIDTH * 0.9,
  },
  content: {
    gap: 16,
  },
  button: {
    marginTop: 10,
  },
});
