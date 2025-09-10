import { WalletDisconnectButton , WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Deposit } from "./Deposit";
import { LiquidUnstake } from "./LiquidUnstake";
function Panel() {
    return (
        <div className="mx-auto mt-10 h-[550px] w-[30vw] border-2 border-white  rounded-2xl p-8 bg-gray-900">
            <div className="flex justify-between">
                <WalletMultiButton/>
                <WalletDisconnectButton/>
            </div>

            <div>
                <Deposit/>
                <LiquidUnstake/>
            </div>
        </div>
    );
}

export default Panel;