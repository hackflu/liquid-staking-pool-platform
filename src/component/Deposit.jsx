import { WalletError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { MarinadeUtils } from "@marinade.finance/marinade-ts-sdk";
import { useMarinade } from "./marinade/MarinadeProvider";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const Deposit = () => {
  const [amount, setAmount] = useState(0);
  const [processingTransaction, setProcessingTransaction] = useState(false);

  const { connection } = useConnection();
  const { sendTransaction } = useWallet();
  const { marinade } = useMarinade();

  if (!marinade) {
    console.log("not marinade");
    return <></>;
  }

  const handleStake = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount!");
      return;
    }

    try {
      setProcessingTransaction(true);
      toast.loading("Processing transaction...");

      const { transaction } = await marinade.deposit(
        MarinadeUtils.solToLamports(amount)
      );
      const transactionSignature = await sendTransaction(transaction, connection);

      toast.dismiss();
      toast.success(`Transaction successful!`);
      console.log(transactionSignature);
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

      <h2 className="text-white text-xl font-bold mb-4">Stake SOL</h2>

      <input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value) || 0)}
        placeholder="Enter SOL amount"
        className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
      />

      <button
        onClick={handleStake}
        disabled={processingTransaction}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
          processingTransaction
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {processingTransaction ? "Processing..." : "Stake SOL using Marinade!"}
      </button>
    </>
  );
};
