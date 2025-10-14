import { Call } from "@/service/call"

export const addthesubscribe = (Email: string) => Call({
    path: "/addsubscribe",
    method: "POST",
    request: {
        Email
    }
})