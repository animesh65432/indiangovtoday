import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/context/Lan";
import { CurrentdateProvider } from "@/context/Currentdate";
import { AnnouncementsProvider } from "@/context/AnnouncementsProvider"
import { FilterAnnouncementsProvider } from "@/context/FilterAnnoucements"
import ScrollBackgroundEffect from "@/components/ScrollBackgroundEffect";
import { PageNationProvider } from "@/context/PageNationProvider"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <PageNationProvider>
        <FilterAnnouncementsProvider>
          <AnnouncementsProvider>
            <CurrentdateProvider>
              <Component {...pageProps} />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <ScrollBackgroundEffect />
            </CurrentdateProvider>
          </AnnouncementsProvider>
        </FilterAnnouncementsProvider>
      </PageNationProvider>
    </LanguageProvider>
  );
}