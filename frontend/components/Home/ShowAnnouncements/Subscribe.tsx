import React, { useContext } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from "@/lib/translatetext"
import { addthesubscribe } from "@/api/aleart"
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react"

const Subscribe: React.FC = () => {
    const [Email, setEmail] = React.useState<string>("");
    const [IsLoading, SetIsLoading] = React.useState<boolean>(false);
    const { language } = useContext(LanguageContext)

    const handlesubscribe = async () => {
        if (!Email) {
            toast.error(`${TranslateText[language].PLEASE_ENTER_YOUR_EMAIL}`);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(Email)) {
            toast.error(`${TranslateText[language].PLEASE_ENTER_A_VALID_EMAIL}`);
            return;
        }

        SetIsLoading(true);
        try {
            await addthesubscribe(Email);
            localStorage.setItem("Email", JSON.stringify(Email));
            toast.success(`${TranslateText[language].SUCCESSFULLY_SUBSCRIBED}`);
        } catch (err) {
            toast.error(`${TranslateText[language].FAILED_TO_SUBSCRIBE}`);
        } finally {
            SetIsLoading(false);
        }
    };

    return (
        <div className='w-[95%] mt-5 mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-6 p-8 bg-[#f5f3ef] border border-[#e0ddd7]'>


            <div className='flex flex-col gap-1 flex-shrink-0'>
                <h3 className='font-display text-black text-lg font-bold uppercase tracking-wide'>
                    {TranslateText[language].STAY_INFORMED}
                </h3>
                <span className='font-body text-[#999] text-[10px] uppercase tracking-[0.14em]'>
                    {TranslateText[language].DIRECT_NOTICE_TO_YOUR_INBOX}
                </span>
            </div>


            <div className='hidden sm:block w-px h-8 bg-white flex-shrink-0' />


            <div className='flex w-full'>
                <Input
                    type='email'
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`${TranslateText[language].EMAIL_ADRESS}`}
                    className='flex-1 rounded-none border border-[#d0ccc5] bg-white text-black placeholder:text-[#bbb] placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest focus:border-black focus:ring-0 h-10'
                />
                <Button
                    onClick={handlesubscribe}
                    className='rounded-none bg-[#050505] text-white font-bold uppercase text-[10px] tracking-[0.14em] hover:bg-[#333] transition-colors h-10 px-5 flex-shrink-0'
                >
                    {IsLoading
                        ? <LoaderCircle className='animate-spin h-4 w-4' />
                        : `${TranslateText[language].SUBSCRIBE_NOW}`}
                </Button>
            </div>

        </div>
    )
}

export default Subscribe