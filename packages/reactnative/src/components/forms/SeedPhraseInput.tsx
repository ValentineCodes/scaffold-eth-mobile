import { View } from "react-native";
import React, { useState } from "react";
import { TextInput, Text, IconButton } from "react-native-paper";
import { COLORS } from "../../utils/constants";
import { FONT_SIZE } from "../../utils/styles";
import { TouchableOpacity } from "react-native";

type Props = {
  value?: string;
  infoText?: string | null;
  errorText?: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export default function SeedPhraseInput({
  value,
  infoText,
  errorText,
  onChange,
  onBlur,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: FONT_SIZE["xl"], fontWeight: "bold" }}>
        Seed Phrase
      </Text>
      <TextInput
        mode="outlined"
        style={{
          borderRadius: 8,
          paddingTop: 16,
          paddingLeft: 16,
          paddingRight: 80,
          paddingBottom: 48,
          fontSize: 16,
        }}
        outlineColor={COLORS.primary}
        activeOutlineColor={COLORS.primary}
        value={value}
        right={
          <View style={{ flexDirection: "row", gap: 4, position: "absolute", right: 8, top: 20 }}>
            {value && (
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={() => onChange("")}
              >
                <IconButton
                  icon="close"
                  size={20}
                  iconColor="#a3a3a3"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => setShow(!show)}
            >
              <IconButton
                icon={show ? "eye" : "eye-off"}
                size={20}
                iconColor="#a3a3a3"
              />
            </TouchableOpacity>
          </View>
        }
        secureTextEntry={!show}
        multiline={show}
        placeholder="Seed Phrase"
        onChangeText={onChange}
        onBlur={onBlur}
        selectionColor={COLORS.primary}
        cursorColor="#303030"
      />
      {infoText ? (
        <Text style={{ fontSize: 14, color: "#a3a3a3" }}>
          {infoText}
        </Text>
      ) : null}
      {errorText ? (
        <Text style={{ fontSize: 14, color: "#ef4444" }}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}
