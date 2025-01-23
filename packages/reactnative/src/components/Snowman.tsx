import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import { Text } from "react-native-paper";
import { COLORS } from "../utils/constants";
import { SvgXml } from "react-native-svg";
import base64 from "base-64";
import { WINDOW_WIDTH } from "../utils/styles";
import { useDeployedContractInfo } from "../hooks/scaffold-eth/useDeployedContractInfo";
import { ethers } from "ethers";
import useNetwork from "../hooks/scaffold-eth/useNetwork";

type Props = {
  id: number;
  remove: () => void;
};

interface Metadata {
  name: string;
  image: string;
}

export default function Snowman({ id, remove }: Props) {
  const [metadata, setMetadata] = useState<Metadata>();
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const spinValue = useRef(new Animated.Value(0)).current;

  const ISnowman = useRef(null);
  const network = useNetwork();
  const { data: snowmanContract, isLoading: isLoadingSnowmanContract } =
    useDeployedContractInfo("Snowman");

  useEffect(() => {
    if (isLoading) {
      const animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();

      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);

      return () => {
        animation.stop();
        clearInterval(interval);
      };
    }
  }, [isLoading, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const getDetails = async () => {
    if (isLoadingSnowmanContract) return;

    try {
      setIsLoading(true);
      const provider = new ethers.JsonRpcProvider(network.provider);

      ISnowman.current = new ethers.Contract(
        snowmanContract?.address,
        snowmanContract?.abi,
        provider,
      );

      const tokenURI: string = await ISnowman.current.tokenURI(id);
      const metadata = JSON.parse(
        base64.decode(tokenURI.replace("data:applicaton/json;base64,", "")),
      );
      const decodedMetadataImage = base64.decode(
        metadata.image.replace("data:image/svg+xml;base64,", ""),
      );
      metadata.image = decodedMetadataImage;

      setMetadata(metadata);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, [isLoadingSnowmanContract]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.spinner,
            {
              width: 40,
              height: 40,
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <Text variant="bodyLarge" style={styles.text}>
          Loading{dots}
        </Text>
      </View>
    );
  }

  if (!metadata) return null;

  return (
    <View>
      <SvgXml
        xml={metadata.image}
        width={WINDOW_WIDTH * 0.8}
        height={WINDOW_WIDTH * 0.8}
      />
      <View style={styles.nameContainer}>
        <Text variant="bodyMedium" style={styles.name}>
          {metadata.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    borderWidth: 3,
    borderRadius: 100,
    borderColor: COLORS.primary,
    borderTopColor: "transparent",
  },
  text: {
    minWidth: 80,
    textAlign: "center",
    color: COLORS.primary,
  },
  nameContainer: {
    position: "absolute",
    top: 7,
    left: 2,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  name: {
    fontWeight: "500",
  },
});
