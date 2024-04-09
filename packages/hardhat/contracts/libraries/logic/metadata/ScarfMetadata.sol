// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Strings} from "../../../dependencies/Strings.sol";
import {Base64} from "base64-sol/base64.sol";

import {DataTypes} from "../../types/DataTypes.sol";
import {TokenURIGen} from "../../utils/TokenURIGen.sol";
import {TypeCast} from "../../utils/TypeCast.sol";

library ScarfMetadata {
  using Strings for uint256;

  function tokenURI(DataTypes.Scarf calldata scarf, uint256 tokenId) external pure returns (string memory) {
    string memory name = string(abi.encodePacked("Scarf#", tokenId.toString()));
    string memory description = string(abi.encodePacked("This is a scarf colored #", scarf.color));
    string memory image = Base64.encode(bytes(generateSVG(scarf)));

    return TokenURIGen.generateSVGTokenURI(name, description, image);
  }

  function renderTokenById(DataTypes.Scarf calldata scarf) public pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<path d="M696.804 486.5H858.653C866.032 486.5 872.779 490.666 876.086 497.263L887.271 519.581C893.849 532.706 884.113 548.118 869.435 547.814L689.349 544.087C675.877 543.808 666.741 530.274 671.52 517.675L678.572 499.084C681.445 491.509 688.703 486.5 696.804 486.5Z" fill="',
          scarf.color,
          '" stroke="black" /><path d="M676.796 505.502C678.056 495.501 686.56 488 696.64 488H723.044C727.344 488 731.53 489.386 734.981 491.953L741.818 497.039C749.479 502.738 752.044 513.057 747.941 521.679L721.82 576.577C719.396 581.672 719.235 587.534 720.889 592.929C726.448 611.061 736.569 655.955 718.013 700C694 757 654 711.579 641 681.156C629.803 654.952 657.063 602.241 664.84 588.124C666.15 585.747 667.015 583.189 667.354 580.497L676.796 505.502Z" fill="',
          scarf.color,
          '" /><path d="M676.796 505.502C678.056 495.501 686.56 488 696.64 488H723.044C727.344 488 731.53 489.386 734.981 491.953L741.818 497.039C749.479 502.738 752.044 513.057 747.941 521.679L721.82 576.577C719.396 581.672 719.235 587.534 720.889 592.929C726.448 611.061 736.569 655.955 718.013 700C694 757 654 711.579 641 681.156C629.803 654.952 657.063 602.241 664.84 588.124C666.15 585.747 667.015 583.189 667.354 580.497L676.796 505.502Z" fill="',
          scarf.color,
          '" /><path d="M718.013 700C694 757 654 711.579 641 681.156C629.803 654.952 657.063 602.241 664.84 588.124C666.15 585.747 667.015 583.189 667.354 580.497L676.796 505.502C678.056 495.501 686.56 488 696.64 488H723.044C727.344 488 731.53 489.386 734.981 491.953L741.818 497.039C749.479 502.738 752.044 513.057 747.941 521.679L721.82 576.577C719.396 581.672 719.235 587.534 720.889 592.929C726.448 611.061 736.569 655.955 718.013 700Z" fill="',
          scarf.color,
          '" stroke="black" />'
        )
      );
  }

  function generateSVG(DataTypes.Scarf calldata scarf) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<svg width="100%" height="100%" viewBox="0 0 1453 1274" fill="none" xmlns="http://www.w3.org/2000/svg">',
          renderTokenById(scarf),
          "</svg>"
        )
      );
  }
}
