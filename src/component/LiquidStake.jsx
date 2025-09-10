import { useState } from "react";
import { web3 } from "@marinade.finance/marinade-ts-sdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletError } from "@solana/wallet-adapter-base";
import { useMarinade } from "./marinade/MarinadeProvider";
import toast, { Toaster } from "react-hot-toast";

export const LiquidateStakeAccount = () => {
  const [stakeAccount, setStakeAccount] = useState("");
  const [processingTransaction, setProcessingTransaction] = useState(false);

  const { connection } = useConnection();
  const { sendTransaction } = useWallet();
  const { marinade } = useMarinade();

  if (!marinade) {
    return null;
  }

  const handleLiquidate = async () => {
    if (!stakeAccount) {
      toast.error("Please enter a stake account address");
      return;
    }

    try {
      setProcessingTransaction(true);
      toast.loading("Processing liquidation...");

      const { transaction } = await marinade.liquidateStakeAccount(
        new web3.PublicKey(stakeAccount)
      );
      const transactionSignature = await sendTransaction(transaction, connection);

      toast.dismiss();
      toast.success(
        <a
          href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          ✅ Liquidation Successful! View on Explorer
        </a>,
        { duration: 6000 }
      );

      console.log(`Transaction Signature: ${transactionSignature}`);
    } catch (err) {
      toast.dismiss();
      if (err instanceof Error && !(err instanceof WalletError)) {
        toast.error(err.message || "Transaction failed");
        console.error(err);
      }
    } finally {
      setProcessingTransaction(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <h2 className="text-white text-xl font-bold mb-4">Liquidate Stake Account</h2>

      <input
        type="text"
        value={stakeAccount}
        onChange={(e) => setStakeAccount(e.target.value)}
        placeholder="Enter stake account address"
        className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
      />

      <button
        onClick={handleLiquidate}
        disabled={processingTransaction}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
          processingTransaction
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        } text-white`}
      >
        {processingTransaction ? "Processing..." : "Liquidate Stake Account"}
      </button>
    </>
  );
};
