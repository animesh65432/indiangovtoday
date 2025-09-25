import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, env, LocalhostUrl } from "@/config";
import { toast } from "react-toastify";

const apiUrl = env === "PROD" ? API_BASE_URL : LocalhostUrl;

export async function Call<T, ResponseType>({
    path,
    request,
    suppressError = false,
    headers = {},
    method,
    formDataRequest = false,
    responseType,
}: {
    path: string;
    request?: T;
    suppressError?: boolean;
    method: "POST" | "GET" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    formDataRequest?: boolean;
    responseType?: "json" | "blob"; // <-- Add this
}): Promise<ResponseType> {
    const mergedPath = path.startsWith("https://") ? path : `${apiUrl}${path}`;

    const config: AxiosRequestConfig = {
        method,
        url: mergedPath,
        headers: headers || {},
        withCredentials: true,
        responseType: responseType || "json",
    };

    if (formDataRequest && request instanceof FormData) {
        config.data = request;
    } else if (request && responseType !== "blob") {
        config.data = JSON.stringify(request);
        config.headers = {
            ...config.headers,
            "Content-Type": "application/json",
        };
    }
    else if (request) {
        config.data = request;
    }

    try {
        const response: AxiosResponse<ResponseType> = await axios(config);
        return response.data;
    } catch (error: unknown) {
        if (!suppressError) {
            console.error(error);
        }

        if (axios.isAxiosError(error)) {
            if (error.response) {
                toast.error(`${error.response.data}`);
            } else if (error.request) {
                console.error("Error Request:", error.request);
                toast.error("Too many requests, please try again later.")
            } else {
                console.error("Error Message:", error.message);
                toast.error("Too many requests, please try again later.")
            }
        }

        throw {
            handled: !suppressError,
            wrapped: "",
        };
    }
}