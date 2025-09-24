import { Call } from "../service/call";

export const singinwithgoogle = (credential: string, clientId: string) => Call({
    path: "/google/auth",
    method: "POST",
    request: {
        clientId,
        credential
    }
})