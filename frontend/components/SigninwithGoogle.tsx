import React, { useRef, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { singinwithgoogle } from "@/api/user"
import { Loader, X, Shield, CheckCircle } from "lucide-react"
import jscookie from "js-cookie"
import { useAuthstore } from '@/store/useauth';
import { useClickOutside } from "@/hooks/useClickoutside"
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next"

type Props = {
    setauth: React.Dispatch<React.SetStateAction<boolean>>
}


const SigninwithGoogle: React.FC<Props> = ({ setauth }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isSinginLoading, setisSinginLoading] = useState<boolean>(false)
    const { t } = useTranslation()
    const { addtoken } = useAuthstore()

    const onsinginwithgoogle = async (data: CredentialResponse) => {
        setisSinginLoading(true)
        try {
            const res = await singinwithgoogle(data.credential!, data.clientId!) as { message: string, token: string }
            addtoken(res.token)
            jscookie.set("token", res.token)
            setauth(false);
            toast.success("Successfully logged in")
        } finally {
            setisSinginLoading(false)
        }
    }

    useClickOutside(modalRef, () => {
        setauth(false)
    })

    const handleClose = () => {
        setauth(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in slide-in-from-bottom-4 duration-300 overflow-hidden"
            >

                <div className="relative p-8 pb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-80 transition-all duration-200 group"
                        aria-label="Close modal"
                    >
                        <X size={20} className="text-gray-500 group-hover:text-gray-700" />
                    </button>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <Shield size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">
                            {t("SinginPage.title")}
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {t("SinginPage.subtitle")}
                        </p>
                    </div>
                </div>


                <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span>{t("SinginPage.description.first")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span>{t("SinginPage.description.second")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span>{t("SinginPage.description.third")}</span>
                        </div>
                    </div>
                </div>


                <div className="p-8">
                    <div className="text-center">
                        {isSinginLoading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                                    <Loader className="absolute inset-0 m-auto w-6 h-6 text-green-600 animate-pulse" />
                                </div>
                                <p className="text-gray-600 text-sm">Signing you in...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors duration-200">
                                    <GoogleLogin
                                        onSuccess={(data) => onsinginwithgoogle(data)}
                                        theme="outline"
                                        size="large"
                                        width="100%"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {t("SinginPage.metadata")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>


                <div className="px-8 pb-6">
                    <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                        <p className="text-sm text-green-700">
                            🔒{t("SinginPage.Privacy")}
                        </p>
                    </div>
                </div>
            </div>
        </div>)
};

export default SigninwithGoogle;