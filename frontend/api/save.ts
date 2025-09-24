import { Call } from "@/service/call"


export const addsave = () => Call({
    method: "POST",
    path: "/"
})

export const GetallSaves = () => Call({
    method: "GET",
    path: "/"
})