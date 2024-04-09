import React, { useEffect, useRef, useState } from 'react'
import { useDeployedContractInfo } from '../hooks/scaffold-eth/useDeployedContractInfo'
import { Spinner, Text, View } from 'native-base'
import { COLORS } from '../utils/constants'
import { ethers } from 'ethers'
import useNetwork from '../hooks/scaffold-eth/useNetwork'
import { SvgXml } from 'react-native-svg';
import base64 from 'base-64';
import { WINDOW_WIDTH } from '../utils/styles'

type Props = { id: number, remove: () => void }
interface Metadata {
    name: string,
    image: string
}

export default function Snowman({ id, remove }: Props) {
    const [metadata, setMetadata] = useState<Metadata>()
    const [isLoading, setIsLoading] = useState(true)

    const ISnowman = useRef(null)

    const network = useNetwork()

    const { data: snowmanContract, isLoading: isLoadingSnowmanContract } = useDeployedContractInfo("Snowman")

    const getDetails = async () => {
        if (isLoadingSnowmanContract) return

        try {
            setIsLoading(true)
            const provider = new ethers.providers.JsonRpcProvider(network.provider)

            ISnowman.current = new ethers.Contract(snowmanContract?.address, snowmanContract?.abi, provider)

            const tokenURI: string = await ISnowman.current.tokenURI(id);
            const metadata = JSON.parse(base64.decode(tokenURI.replace("data:applicaton/json;base64,", "")))
            const decodedMetadataImage = base64.decode(metadata.image.replace("data:image/svg+xml;base64,", ""))
            metadata.image = decodedMetadataImage

            setMetadata(metadata)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getDetails()
    }, [isLoadingSnowmanContract])

    if (isLoading) return <Spinner color={COLORS.primary} />
    if (!metadata) return

    return (
        <View>
            <SvgXml xml={metadata.image} width={WINDOW_WIDTH * 0.8} height={WINDOW_WIDTH * 0.8} />
            <View position={"absolute"} top={7} left={2} bgColor={COLORS.primaryLight} px={"2"} rounded={"md"}>
                <Text fontSize={"md"} fontWeight={"medium"}>{metadata.name}</Text>
            </View>
        </View>
    )
}