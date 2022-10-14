import { ApiError } from "./ApiError";
import axios from "axios";
import { API_URL } from "../Enum/EnvironmentVariable";
import { localStore } from "../Stores/LocalStore";

export interface GetNonceFromWalletAddressReponse {
    nonce: string;
}

// auth api don't use token header so it will use its own axios client
// instead of "axiosClient.ts"
class AuthApi {
    constructor() {}

    public async getNonceFromWalletAddress(
        walletAddress: string
    ): Promise<GetNonceFromWalletAddressReponse> {
        const data = await axios
            .get(`${API_URL}/web3login/getNonce`, {
                params: { walletAddress },
            })
            .then((res) => res.data);
        return data;
    }

    /**
     * Verify signature after signed message in MetaMask
     * if verify with result OK server will return authToken
     * @param walletAddress
     * @param signature
     */
    public async verifySignature(
        walletAddress: string,
        signature: string
    ): Promise<void> {
        const data = await axios
            .post(`${API_URL}/web3login/verifySignature`, {
                walletAddress,
                signature,
            })
            .then((res) => res.data)
            .catch((err) => {
                if (err.response) {
                    if (err.response.status == 417) {
                        throw new ApiError(err.response.data?.message);
                    }
                }
            });

        localStore.setAuthToken(data.authToken);
    }
}

export const authApi = new AuthApi();
