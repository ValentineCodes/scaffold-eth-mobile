import { Dimensions } from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").height

const sm = DEVICE_WIDTH * 0.014
const md = DEVICE_WIDTH * 0.017
const lg = DEVICE_WIDTH * 0.02
const xl = DEVICE_WIDTH * 0.023

export const FONT_SIZE = {
    sm,
    md,
    lg,
    xl
}