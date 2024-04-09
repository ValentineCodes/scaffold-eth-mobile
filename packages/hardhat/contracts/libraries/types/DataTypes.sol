// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library DataTypes {
  enum AccessoryPosition {
    Foreground,
    Background
  }

  struct Accessory {
    address _address;
    AccessoryPosition position;
  }

  struct Snowman {
    int256 eyeOffsetX;
    int256 eyeOffsetY;
    string cloudColor;
    string buttonColor;
    int256 snowAnimOffsetX;
  }

  struct Hat {
    string color;
  }

  struct Scarf {
    string color;
  }

  struct Belt {
    string color;
  }
}
