import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Modal, IconButton } from "react-native-paper";
import { Camera } from "react-native-camera-kit";
import { Camera as VCamera } from "react-native-vision-camera";
import { useToast } from "react-native-toast-notifications";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onReadCode: (value: string) => void;
};

export default function QRCodeScanner({ isOpen, onClose, onReadCode }: Props) {
  const [isCameraPermitted, setIsCameraPermitted] = useState(false);
  const toast = useToast();

  const requestCameraPermission = async () => {
    const cameraPermission = await VCamera.getCameraPermissionStatus();

    if (cameraPermission === "restricted") {
      toast.show("Cannot use camera", { type: "danger" });
      onClose();
    } else if (
      cameraPermission === "not-determined" ||
      cameraPermission === "denied"
    ) {
      try {
        const newCameraPermission = await VCamera.requestCameraPermission();
        if (newCameraPermission === "granted") {
          setIsCameraPermitted(true);
        } else {
          toast.show(
            "Camera permission denied. Go to your device settings to Enable Camera",
            { type: "warning" },
          );
          onClose();
        }
      } catch (error) {
        toast.show("Go to your device settings to Enable Camera", {
          type: "normal",
          duration: 5000,
        });
        onClose();
      }
    } else {
      setIsCameraPermitted(true);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (!isOpen || !isCameraPermitted) return null;

  return (
    <Modal visible={true} onDismiss={onClose} style={styles.modal}>
      <Camera
        scanBarcode={true}
        onReadCode={(event) => {
          onReadCode(event.nativeEvent.codeStringValue);
        }}
        showFrame={true}
        laserColor="blue"
        frameColor="white"
        style={styles.scanner}
      />
      <IconButton
        icon="close"
        size={24}
        iconColor="white"
        onPress={onClose}
        style={styles.closeIcon}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    backgroundColor: "black",
  },
  scanner: {
    width: "100%",
    height: "100%",
  },
  closeIcon: {
    position: "absolute",
    top: 50,
    right: 15,
  },
});
