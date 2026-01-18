import React, { useContext } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { LanguageContext } from '@/context/Lan'
import { TranslateText } from "@/lib/translatetext"
import { } from "react-toastify"
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
        <div className='bg-white w-full flex flex-col p-4 gap-5'>
            <div className='flex flex-col gap-2'>
                <h3 className='uppercase'>{TranslateText[language].STAY_INFORMED}</h3>
                <span className='uppercase text-[0.8rem]'>{TranslateText[language].DIRECT_NOTICE_TO_YOUR_INBOX}</span>
            </div>

            <Input
                type='email'
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${TranslateText[language].EMAIL_ADRESS}`}
                className='w-full  p-5 rounded-none border-b border-gray-300 placeholder:uppercase  '
            />

            <Button
                onClick={handlesubscribe}
                className='uppercase bg-yellow-600 text-black font-semibold'
            >
                {IsLoading ? <LoaderCircle className='animate-spin h-4 w-4' /> : `${TranslateText[language].SUBSCRIBE_NOW}`}
            </Button>

        </div>
    )
}

export default Subscribe