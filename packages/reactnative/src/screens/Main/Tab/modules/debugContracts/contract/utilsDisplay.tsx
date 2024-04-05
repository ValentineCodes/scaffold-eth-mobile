import { ReactElement } from "react";
import { TransactionBase, TransactionReceipt, formatEther, isAddress } from "viem";
import Address from "../../../../../../components/scaffold-eth/Address";
import { replacer } from "../../../../../../../utils/scaffold-eth/common";
import { Text } from "native-base";

type DisplayContent =
  | string
  | number
  | bigint
  | Record<string, any>
  | TransactionBase
  | TransactionReceipt
  | undefined
  | unknown;

export const displayTxResult = (
  displayContent: DisplayContent | DisplayContent[],
  asText = false,
): string | ReactElement | number => {
  if (displayContent == null) {
    return "";
  }

  if (typeof displayContent === "bigint") {
    try {
      const asNumber = Number(displayContent);
      if (asNumber <= Number.MAX_SAFE_INTEGER && asNumber >= Number.MIN_SAFE_INTEGER) {
        return asNumber;
      } else {
        return "Ξ" + formatEther(displayContent);
      }
    } catch (e) {
      return "Ξ" + formatEther(displayContent);
    }
  }

  if (typeof displayContent === "string" && isAddress(displayContent)) {
    return asText ? displayContent : <Address address={displayContent} />;
  }

  if (Array.isArray(displayContent)) {
    const mostReadable = (v: DisplayContent) =>
      ["number", "boolean"].includes(typeof v) ? v : displayTxResultAsText(v);
    const displayable = JSON.stringify(displayContent.map(mostReadable), replacer);

    return asText ? (
      displayable
    ) : (
      <Text>{displayable.replaceAll(",", ",\n")}</Text>
    )
  }

  return JSON.stringify(displayContent, replacer, 2);
}

const displayTxResultAsText = (displayContent: DisplayContent) => displayTxResult(displayContent, true);
