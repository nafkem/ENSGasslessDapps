// import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { ethers } from "ethers";

// import { useNavigate } from "react-router-dom";

import { isSupportedChain } from "../utils";
import { getProposalsContract } from "../ constants/Contracts/contracts";
import { getProvider } from "../ constants/Contracts/providers";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";

export default function RegisterENS() {
  const [selectedFile, setSelectedFile] = useState();
  const [ensName, setEnsName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  const { walletProvider } = useWeb3ModalProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (!selectedFile && !ensName) {
      return toast.error("Please select an image or enter an ensName");
    } else {
      formData.append("file", selectedFile);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const fileUrl = await res.json();

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const contract = getProposalsContract(signer);

      try {
        const tx = await contract.registerNameService(
          ethers.encodeBytes32String(ensName),
          fileUrl.IpfsHash
        );
        const receipt = await tx.wait();

        console.log("receipt: ", receipt);

        let notification;

        if (receipt.status) {
          notification = "Account created successfully";
        } else {
          return toast.error("Account creation failed");
        }

        toast.success(notification);
      } catch (error) {
        console.log(error);

        let errorMessage;

        if (error.reason === "rejected") {
          errorMessage = "Transaction rejected";
        } else {
          console.log("Error", error);
        }

        return toast.error(errorMessage);
      }
    }

    setEnsName("");
    setSelectedFile();
  };

  return (
    <div className="ml-20 mt-28 items-center justify-center">
      <div className="my-12 ml-5 border-2 border-grey-700 bg-white-300 max-w-lg p-8 rounded-lg">
        <input
          type="file"
          accept="image/*"
          // hidden
          className="hidden"
          id="selectFile"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <label
          htmlFor="selectFile"
          className="rounded-full bg-primary flex items-center justify-center cursor-pointer"
        >
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              className="w--20 h-20 object-cover rounded-xl"
              alt="Selected File"
            />
          ) : (
            <img
              className="w-30 h-20 rounded-md border-gray-600 border-2 p-0"
              src="../images/images.jpeg"
              alt="dApp Logo"
            />
          )}
        </label>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col my-4 w-full gap-4"
        >
          <div className="space-y-2 flex flex-col">
            <label className="text-md font-bold">ENS Name</label>
            <input
              value={ensName}
              placeholder="nafkem.Eth"
              onChange={(e) => setEnsName(e.target.value)}
              className="rounded-md bg-purple-50 text-gray-700 font-medium pl-2 h-10"
            />
          </div>

          <button className="bg-green-700 hover:bg-white-600 transition duration-300">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
