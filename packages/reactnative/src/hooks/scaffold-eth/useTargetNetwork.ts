import React from 'react'
import scaffoldConfig from "../../../scaffold.config";

export default function useTargetNetwork() {
    const { targetNetworks } = scaffoldConfig;

    return targetNetworks[0]
}