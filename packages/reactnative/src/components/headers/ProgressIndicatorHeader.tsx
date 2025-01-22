import { View, Dimensions } from "react-native";
import React from "react";
import { IconButton } from "react-native-paper";
// @ts-ignore
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import ProgressStepIndicator from "../ProgressStepIndicator";
import { useNavigation } from "@react-navigation/native";
import { FONT_SIZE } from "../../utils/styles";

type Props = {
  progress: number;
};

const ProgressIndicatorHeader = ({ progress }: Props) => {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <IconButton
        icon={() => (
          <Ionicons
            name="arrow-back-outline"
            size={1.3 * FONT_SIZE["xl"]}
            color="black"
          />
        )}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          position: "absolute",
          top: 3.5,
          left: Dimensions.get("window").width * 0.19,
        }}
      >
        <ProgressStepIndicator
          steps={3}
          progress={progress}
          width={Dimensions.get("window").width * 0.5}
          size={Dimensions.get("window").width * 0.04}
        />
      </View>
    </View>
  );
};

export default ProgressIndicatorHeader;
