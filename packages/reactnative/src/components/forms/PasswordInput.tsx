import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  label: string;
  value?: string;
  suggestion?: string;
  defaultValue?: string;
  infoText?: string | boolean | null;
  errorText?: string | boolean | null;
  onChange: (value: string) => void;
};

function PasswordInput({
  label,
  value,
  suggestion,
  defaultValue,
  infoText,
  errorText,
  onChange
}: Props) {
  const [show, setShow] = useState(false);

  const useSuggestion = () => {
    onChange(suggestion);
  };

  return (
    <View style={{ gap: 8 }}>
      <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
        {label}
      </Text>
      <TextInput
        defaultValue={defaultValue}
        value={value}
        mode="outlined"
        outlineColor={COLORS.primary}
        activeOutlineColor={COLORS.primary}
        style={{ fontSize: FONT_SIZE.md }}
        left={<TextInput.Icon icon="lock" color="#a3a3a3" />}
        right={
          value || !suggestion ? (
            <View style={{ flexDirection: 'row' }}>
              {value && (
                <TextInput.Icon
                  icon="close"
                  color="#a3a3a3"
                  onPress={() => onChange('')}
                />
              )}
              <TextInput.Icon
                icon={show ? 'eye' : 'eye-off'}
                color="#a3a3a3"
                onPress={() => setShow(!show)}
              />
            </View>
          ) : (
            <TextInput.Affix
              text="Use Suggestion"
              textStyle={{ color: COLORS.primary, fontSize: FONT_SIZE.lg }}
              onPress={useSuggestion}
            />
          )
        }
        secureTextEntry={!show}
        placeholder={suggestion ? `Suggestion: ${suggestion}` : 'Password'}
        onChangeText={onChange}
      />
      {infoText ? (
        <Text variant="bodySmall" style={{ color: '#a3a3a3' }}>
          {infoText}
        </Text>
      ) : null}
      {errorText ? (
        <Text variant="bodySmall" style={{ color: '#ef4444' }}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

export default PasswordInput;
