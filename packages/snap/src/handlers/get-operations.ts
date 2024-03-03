import { getAccount, getActiveAccount } from "../accounts/manage-account";
import { getAccountOperations } from "../operations";
import { Handler } from "./handler";

export type GetOperationsParams = {
  address?: string;
}

export type GetOperationsResponse = {
  tokens: string[];
}

export const getOperations: Handler<GetOperationsParams, GetOperationsResponse> = async (params) => {
  const account = params.address ? await getAccount(params.address) : await getActiveAccount();

  if (!account) {
    throw new Error(`Account not found: ${params.address}`);
  }
  return {
    tokens: await getAccountOperations(account.address!),
  };
}