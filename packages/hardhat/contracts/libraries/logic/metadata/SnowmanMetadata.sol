// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Strings} from "../../../dependencies/Strings.sol";
import {Base64} from "base64-sol/base64.sol";

import {DataTypes} from "../../types/DataTypes.sol";
import {TokenURIGen} from "../../utils/TokenURIGen.sol";
import {TypeCast} from "../../utils/TypeCast.sol";

abstract contract Accessory {
  function renderTokenById(uint256 id) external view virtual returns (string memory);

  function transferFrom(address from, address to, uint256 id) external virtual;
}

library SnowmanMetadata {
  using Strings for uint256;
  using Strings for int256;

  function tokenURI(
    DataTypes.Accessory[] calldata accessories,
    mapping(address => mapping(uint256 => uint256)) storage s_accessoriesById,
    DataTypes.Snowman calldata snowman,
    uint256 tokenId
  ) external view returns (string memory) {
    string memory name = string(abi.encodePacked("Snowman#", tokenId.toString()));
    string memory description = "This is a snowman";
    string memory image = Base64.encode(bytes(generateSVG(accessories, s_accessoriesById, snowman, tokenId)));

    return TokenURIGen.generateSVGTokenURI(name, description, image);
  }

  function renderSnowman(DataTypes.Snowman calldata snowman) internal pure returns (string memory) {
    string memory face = string(
      abi.encodePacked(
        '<path d="M936 394C936 463.274 868.961 520 785.5 520C702.039 520 635 463.274 635 394C635 324.726 702.039 268 785.5 268C868.961 268 936 324.726 936 394Z" fill="white" stroke="#ccc" stroke-width="4" /> <path d="M759.13 336.817C759.13 349.926 747.955 360.635 734.065 360.635C720.175 360.635 709 349.926 709 336.817C709 323.709 720.175 313 734.065 313C747.955 313 759.13 323.709 759.13 336.817Z" fill="#F9F8F8" stroke="black" stroke-width="2" /> <path d="M863.389 336.817C863.389 349.926 852.214 360.635 838.324 360.635C824.435 360.635 813.259 349.926 813.259 336.817C813.259 323.709 824.435 313 838.324 313C852.214 313 863.389 323.709 863.389 336.817Z" fill="white" stroke="black" stroke-width="2" />',
        '<ellipse rx="16.2906" ry="14.5159" fill="#0D0D0D" transform="translate(',
        (733 + snowman.eyeOffsetX).toString(),
        ",",
        (337 + snowman.eyeOffsetY).toString(),
        ')" /><ellipse rx="16.2906" ry="14.5159" fill="#0F0F0F" transform="translate(',
        (838 + snowman.eyeOffsetX).toString(),
        ",",
        (337 + snowman.eyeOffsetY).toString(),
        ')" /> <path d="M727.53 426.093C717.139 429.791 715.725 433.162 722.28 441.842" stroke="black" stroke-width="3" /> <path d="M844 430.671C855.087 437.025 855.507 441.01 848.695 448.669" stroke="black" stroke-width="3" /> <path d="M733 434C770.692 452.514 802.237 455.433 838 434" stroke="black" stroke-width="5" /> <path d="M878.688 393.576C880.355 393.878 881.964 394.163 883.507 394.429L772.637 411.249C769.048 403.006 769.05 392.909 770.132 384.422C770.703 379.946 771.56 376.023 772.275 373.22C772.496 372.352 772.703 371.594 772.883 370.961C773.706 371.151 774.739 371.388 775.96 371.668C779.37 372.451 784.25 373.565 790.13 374.894C801.889 377.551 817.651 381.065 833.658 384.492C849.66 387.918 865.927 391.262 878.688 393.576Z" fill="#D98A2C" stroke="black" stroke-width="5" /> <path d="M837.236 296.02C857.236 296.02 865.236 296.02 880.984 320.452" stroke="black" stroke-width="8" /> <path d="M724.736 296.316C704.25 300.449 694.485 304.94 686.236 324.52" stroke="black" stroke-width="8" />'
      )
    );

    string
      memory middleBody = '<path d="M1013.5 649.029C1013.5 691.282 987.978 736.639 947.383 771.531C906.836 806.382 851.567 830.5 792.671 830.5C733.777 830.5 678.927 806.384 638.797 771.539C598.622 736.655 573.5 691.296 573.5 649.029C573.5 607.015 598.344 575.478 638.328 554.312C678.373 533.113 733.347 522.5 792.671 522.5C851.994 522.5 907.388 533.113 947.852 554.317C988.263 575.493 1013.5 607.034 1013.5 649.029Z" fill="white" stroke="#ccc" stroke-width="5" /><line x1="603.503" y1="647.354" x2="410.503" y2="520.354" stroke="#562C1F" stroke-width="20" /><path d="M416 520V403" stroke="#562C1F" stroke-width="20" /><line x1="410.873" y1="517.578" x2="300.873" y2="550.578" stroke="#562C1F" stroke-width="20" /><line x1="970.06" y1="638.955" x2="1142.06" y2="511.955" stroke="#562C1F" stroke-width="20" /><line x1="1138" y1="512" x2="1138" y2="386" stroke="#562C1F" stroke-width="20" /><line x1="1138.49" y1="510.012" x2="1280.49" y2="517.012" stroke="#562C1F" stroke-width="20" />';

    string memory lowerBody = string(
      abi.encodePacked(
        '<path d="M1130.5 1023.52C1130.5 1075.95 1086.79 1130.42 1019.74 1171.96C952.854 1213.41 863.46 1241.5 773.611 1241.5C683.878 1241.5 603.767 1208.97 546.111 1163.12C488.379 1117.2 453.5 1058.22 453.5 1005.48C453.5 953.051 497.212 898.583 564.261 857.038C631.146 815.594 720.54 787.5 810.389 787.5C900.122 787.5 980.233 820.028 1037.89 865.885C1095.62 911.803 1130.5 970.784 1130.5 1023.52Z" fill="white" stroke="#ccc" stroke-width="5" />',
        '<ellipse cx="792" cy="1013" rx="40" ry="39" fill="',
        snowman.buttonColor,
        '" /><ellipse cx="796.5" cy="886" rx="37.5" ry="39" fill="',
        snowman.buttonColor,
        '" /><ellipse cx="791.5" cy="728.5" rx="32.5" ry="34.5" fill="',
        snowman.buttonColor,
        '" /><ellipse cx="796" cy="617" rx="24" ry="25" fill="',
        snowman.buttonColor,
        '" />'
      )
    );

    return string(abi.encodePacked(face, middleBody, lowerBody));
  }

  function renderTokenById(
    DataTypes.Accessory[] calldata accessories,
    mapping(address => mapping(uint256 => uint256)) storage s_accessoriesById,
    DataTypes.Snowman calldata snowman,
    uint256 tokenId
  ) public view returns (string memory) {
    string memory token = renderSnowman(snowman);

    uint256 numOfAccessories = accessories.length;

    for (uint256 i = 0; i < numOfAccessories; i++) {
      DataTypes.Accessory memory accessory = accessories[i];
      uint256 accessoryTokenId = s_accessoriesById[accessory._address][tokenId];

      if (accessoryTokenId > 0) {
        if (accessory.position == DataTypes.AccessoryPosition.Foreground) {
          token = string(abi.encodePacked(token, Accessory(accessory._address).renderTokenById(accessoryTokenId)));
        } else {
          token = string(abi.encodePacked(Accessory(accessory._address).renderTokenById(accessoryTokenId), token));
        }
      }
    }

    return token;
  }

  function generateSVG(
    DataTypes.Accessory[] calldata accessories,
    mapping(address => mapping(uint256 => uint256)) storage s_accessoriesById,
    DataTypes.Snowman calldata snowman,
    uint256 tokenId
  ) internal view returns (string memory) {
    string memory cloud = string(
      abi.encodePacked('<rect x="1" y="4" width="1433" height="1235" fill="', snowman.cloudColor, '" />')
    );

    string
      memory snowyGround = '<path d="M2.5 1271.5V870.969C193.505 715.311 403.061 701.422 638.973 733.615C737.077 747.003 839.635 768.343 947.273 790.741C969.306 795.326 991.552 799.955 1014.02 804.569C1145.51 831.577 1284.39 858.057 1431.5 872.057V1271.5H2.5Z" fill="white" stroke="#ccc" stroke-width="5" />';

    (string memory snowfallForeground, string memory snowfallBackground) = generateSnowfall(snowman);
    return
      string(
        abi.encodePacked(
          '<svg width="100%" height="100%" viewBox="0 0 1453 1274" fill="none" xmlns="http://www.w3.org/2000/svg">',
          cloud,
          snowyGround,
          snowfallForeground,
          renderTokenById(accessories, s_accessoriesById, snowman, tokenId),
          snowfallBackground,
          "</svg>"
        )
      );
  }

  function generateSnowfall(DataTypes.Snowman calldata snowman) private pure returns (string memory, string memory) {
    string memory snowfallForeground0 = string(
      abi.encodePacked(
        '<g fill="white" stroke="#ccc" stroke-width="3"></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="3.2s" type="translate" from="482 0" to="',
        (482 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="4.8s" type="translate" from="1204 0" to="',
        (1204 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="4.7s" type="translate" from="1170 0" to="',
        (1170 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle>'
      )
    );
    string memory snowfallForeground1 = string(
      abi.encodePacked(
        '<circle r="15.2929"><animateTransform attributeName="transform" dur="3.8s" type="translate" from="1415 0" to="',
        (1415 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="4.4s" type="translate" from="1400 0" to="',
        (1400 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="8.762s" type="translate" from="733 0" to="',
        (733 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="5.762s" type="translate" from="805 0" to="',
        (805 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle>'
      )
    );

    string memory snowfallForeground2 = string(
      abi.encodePacked(
        '<circle r="15.2929"><animateTransform attributeName="transform" dur="3.162s" type="translate" from="900 0" to="',
        (900 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="9.2s" type="translate" from="1085 0" to="',
        (1085 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="9.1s" type="translate" from="226 0" to="',
        (226 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle>'
      )
    );

    string memory snowfallForeground3 = string(
      abi.encodePacked(
        '<circle r="15.2929"><animateTransform attributeName="transform" dur="4.7s" type="translate" from="1009 0" to="',
        (1009 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="6.89s" type="translate" from="132 0" to="',
        (132 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="3.56s" type="translate" from="97 0" to="',
        (97 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle></g>'
      )
    );

    string memory snowfallBackground0 = string(
      abi.encodePacked(
        '<g fill="white" stroke="#ccc" stroke-width="3"><circle r="15.2929"><animateTransform attributeName="transform" dur="8.236s" type="translate" from="504 0" to="',
        (504 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="3.982s" type="translate" from="1250 0" to="',
        (1250 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="4.249s" type="translate" from="205 0" to="',
        (205 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" />'
      )
    );

    string memory snowfallBackground1 = string(
      abi.encodePacked(
        '</circle><circle r="15.2929"><animateTransform attributeName="transform" dur="7.113s" type="translate" from="329 0" to="',
        (329 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="3.5s" type="translate" from="167 0" to="',
        (167 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="4.5s" type="translate" from="1124 0" to="',
        (1124 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle>'
      )
    );

    string memory snowfallBackground2 = string(
      abi.encodePacked(
        '<circle r="15.2929"><animateTransform attributeName="transform" dur="4.782s" type="translate" from="712 0" to="',
        (712 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="7.201s" type="translate" from="355 0" to="',
        (355 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle>'
      )
    );

    string memory snowfallBackground3 = string(
      abi.encodePacked(
        '<circle r="15.2929"><animateTransform attributeName="transform" dur="5.289s" type="translate" from="1204 0" to="',
        (1204 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle><circle r="15.2929"><animateTransform attributeName="transform" dur="4.892s" type="translate" from="596 0" to="',
        (596 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle>'
      )
    );

    string memory snowfallBackground4 = string(
      abi.encodePacked(
        '<circle r="15.2929"><animateTransform attributeName="transform" dur="6.4s" type="translate" from="1216 0" to="',
        (1216 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle>'
      )
    );

    string memory snowfallBackground5 = string(
      abi.encodePacked(
        '<circle r="15.2929"><animateTransform attributeName="transform" dur="3.3s" type="translate" from="707 0" to="',
        (707 + snowman.snowAnimOffsetX).toString(),
        ' 1000" repeatCount="indefinite" /></circle></g>'
      )
    );

    string memory snowfallForeground = string(
      abi.encodePacked(snowfallForeground0, snowfallForeground1, snowfallForeground2, snowfallForeground3)
    );

    string memory snowfallBackground = string(
      abi.encodePacked(
        snowfallBackground0,
        snowfallBackground1,
        snowfallBackground2,
        snowfallBackground3,
        snowfallBackground4,
        snowfallBackground5
      )
    );

    return (snowfallForeground, snowfallBackground);
  }
}
