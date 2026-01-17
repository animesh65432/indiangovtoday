import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { X } from 'lucide-react'
import MobileSerchInputbox from './MobileSerchInputbox'

type Props = {
    ShowFilterCard: boolean;
    SetFilterShowCard: (val: boolean) => void;
    StatesSelected: string[],
    SetStatesSelected: React.Dispatch<React.SetStateAction<string[]>>,
    DeparmentsSelected: string,
    SetDeparmentsSelected: React.Dispatch<React.SetStateAction<string>>
    SearchInput: string,
    SetSearchInput: React.Dispatch<React.SetStateAction<string>>
    onSearch: () => void
}

const ShowFilter: React.FC<Props> = ({
    ShowFilterCard, SetFilterShowCard, StatesSelected, SetStatesSelected,
    DeparmentsSelected, SetDeparmentsSelected,
    SearchInput, SetSearchInput, onSearch
}) => {

    const onClose = () => SetFilterShowCard(false);

    return (
        <AnimatePresence>
            {ShowFilterCard && (
                <div className='fixed inset-0 z-[100] flex flex-col justify-end'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='absolute inset-0 bg-black/60 backdrop-blur-sm z-[100]'
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className='relative z-[200] w-full bg-white rounded-t-[2.5rem] p-6 shadow-2xl max-h-[95vh] flex flex-col'
                    >
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0" />

                        <div className="flex justify-between items-center mb-6 px-2">
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Filters Annoucments</h2>
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-100 text-gray-500 rounded-full active:scale-90 transition-transform"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-2 pb-10">
                            <MobileSerchInputbox
                                StatesSelected={StatesSelected}
                                SetStatesSelected={SetStatesSelected}
                                DeparmentsSelected={DeparmentsSelected}
                                SetDeparmentsSelected={SetDeparmentsSelected}
                                SearchInput={SearchInput}
                                SetSearchInput={SetSearchInput}
                                onSearch={() => {
                                    onSearch();
                                    onClose();
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default ShowFilter