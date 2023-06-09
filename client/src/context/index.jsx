import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xddE6c5EAB30f121d71bA5680E07f93603aD3099d"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, //owner
          form.title, //title
          form.description, //description
          form.target,
          new Date(form.deadline).getTime(), //deadline
          form.image,
        ],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", data);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaign');

    const parsedCampaigns = campaigns.map((campaign,i) => ({
        owner:campaign.owner,
        title:campaign.title,
        description:campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline:campaign.deadline.toNumber(),
       amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
        image:campaign.image,
        pId: i
    }));
     return parsedCampaigns;
    
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();


    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns
  }

  const donate = async (pId, amount) => {
    console.info("pid", pId);
    try {
      const data = await contract.call('donateCampaign',[pId], {value: ethers.utils.parseEther(amount)});
    console.info("contract call success", data);
    return data
    } catch (error) {
      console.log(error)
    }
  }

  //const { mutateAsync: donateCampaign, isLoading } = useContractWrite(contract, "donateCampaign")

//   const donate = async (_id) => {
//     try {
//       const data = await donateCampaign({ args: [_id] });
//       console.info("contract call success", data);
//       return data
//     } catch (err) {
//       console.error("contract call failure", err);
//     }
  
// }


  const getDonations = async (_id) => {
    const donations = await contract.call('getDonators', [_id]);
 //console.log(donations)
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++){
        parsedDonations.push({
            donator: donations[0][i],
            donations: ethers.utils.formatEther(donations[1][i].toString())
        })
    }
    //console.log(parsedDonations)
    return parsedDonations;
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
