import React, { useEffect, useState } from 'react'
import { Modal, Icon, Pressable } from "native-base"
import { Camera } from 'react-native-camera-kit'
import { StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/dist/Ionicons"
import { Camera as VCamera } from 'react-native-vision-camera';
import { useToast } from 'react-native-toast-notifications'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onReadCode: (value: string) => void;
}

export default function QRCodeScanner({ isOpen, onClose, onReadCode }: Props) {
    const [isCameraPermitted, setIsCameraPermitted] = useState(false);

    const toast = useToast()

    const requestCameraPermission = async () => {
        // check permission
        const cameraPermission = await VCamera.getCameraPermissionStatus();

        if (cameraPermission === 'restricted') {
            toast.show("Cannot use camera", {
                type: "danger"
            })
            onClose()
        } else if (
            cameraPermission === 'not-determined' ||
            cameraPermission === 'denied'
        ) {
            try {
                const newCameraPermission = await VCamera.requestCameraPermission();

                if (newCameraPermission === 'granted') {
                    setIsCameraPermitted(true)
                } else {
                    toast.show("Camera permission denied. Go to your device settings to Enable Camera", {
                        type: "warning"
                    })
                    onClose()
                }
            } catch (error) {
                toast.show('Go to your device settings to Enable Camera', {
                    type: 'normal',
                    duration: 5000,
                });
                onClose()
            }
        } else {
            setIsCameraPermitted(true);
        }
    }

    useEffect(() => {
        (async () => {
            await requestCameraPermission();
        })();
    }, [])

    return isOpen && isCameraPermitted && (
        <Modal isOpen onClose={onClose}>
            <Camera
                scanBarcode={true}
                onReadCode={(event) => {
                    onReadCode(event.nativeEvent.codeStringValue)
                }}
                showFrame={true}
                laserColor='blue'
                frameColor='white'
                style={styles.scanner}
            />
            <Pressable onPress={onClose} _pressed={{ opacity: 0.4 }} style={styles.closeIcon}>
                <Icon as={<Ionicons name="close" />} size={10} mr="2" color="white" />
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    scanner: {
        width: '100%',
        height: '100%'
    },
    closeIcon: {
        position: 'absolute',
        top: 50,
        right: 15
    }
})