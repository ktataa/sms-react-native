import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    GetProgramAccountsFilter
  
  } from '@solana/web3.js';
import { useCallback } from "react";
import { suspend } from 'suspend-react'


export default function useGetTokenAccounts(publicKey: PublicKey, connection: Connection) {


  const tokenAccounts = useCallback(async()=>{

    var tokenList:[{
      mint:String | undefined;
      balance:Number | undefined;

    }]=[{mint:undefined,balance:undefined}];

      const filters:GetProgramAccountsFilter[] = [
        {
          dataSize: 165,   
        },
        {
          memcmp: {
            offset: 32,     
            bytes: publicKey.toBase58(),  
          },            
        }];
    const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {filters: filters}
    );
      accounts.forEach((account, i) => {
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:String = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];


        tokenList.push(
          {
            "mint":mintAddress,
            "balance":tokenBalance

          }
        )
    });
    return tokenList

  

   
  },[publicKey,connection])
  

  return{tokenAccounts}

}