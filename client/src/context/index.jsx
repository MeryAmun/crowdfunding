import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';


const StateContext = createContext();

export const StateContextProvider = ({children}) => {
    const { contract } = useContract('0xddE6c5EAB30f121d71bA5680E07f93603aD3099d');
    const { mutateAsync: createCampaign} = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign({
                args:[
                    address,//owner
                    form.title,//title
                    form.description,//description
                    form.target,
                    new Date(form.deadline).getTime(),//deadline
                    form.image
                ]
            });

            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failure", data)
        }
    }

    return (
        <StateContext.Provider value={{
            address,
            contract,
            connect,
            createCampaign:publishCampaign
        }}>
        {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)