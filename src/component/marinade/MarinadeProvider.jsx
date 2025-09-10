import { Marinade, MarinadeConfig, web3 } from '@marinade.finance/marinade-ts-sdk'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { createContext, useContext, useEffect, useState } from 'react'

const defaultContext = {marinade : null}

const MarinadeContext = createContext(defaultContext)

export const useMarinade = ()=> useContext(MarinadeContext)


export const MarinadeProvider = ({children})=>{
    const {connection} = useConnection()
    const {publicKey}= useWallet()

    const [marinade , setMarinade] = useState(null)

    useEffect(()=>{
        if(!publicKey){
            setMarinade(null)
            return
        }

        const config = new MarinadeConfig({
            connection,publicKey
        })

        const marinade = new Marinade(config)

        setMarinade(marinade)
    },[connection , publicKey])
    return (
        <MarinadeContext.Provider value={{marinade}}>
            {children}
        </MarinadeContext.Provider>
    )
}