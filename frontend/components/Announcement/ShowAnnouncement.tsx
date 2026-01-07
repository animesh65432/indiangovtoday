import React from 'react'
import { SectionTypes } from '@/types'
import Header from './Header'
import Title from './Title'
import Details from './Details'
import TextDiv from "./TextDiv"
import KeyInforMation from './KeyInforMation'

type Props = {
    title: string
    source: string
    lan: string,
    announcementId: string,
    state: string,
    date: string,
    category: string,
    department: string,
    sections: SectionTypes[]
    toggle: boolean,
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

const ShowAnnouncement: React.FC<Props> = ({ toggle, setToggle, title, source, lan, date, state, sections, department, category }) => {
    return (
        <section className='w-[82%] mx-auto  flex flex-col gap-10 pt-7  pb-8'>
            <Header
                title={title}
                sections={sections}
                toggle={toggle}
                setToggle={setToggle}
            />
            <Title
                title={title}
            />
            <div className='flex flex-col xl:flex-row gap-10'>
                <div className='w-[65%] hidden xl:block'>
                    <TextDiv
                        heading={sections[0].heading}
                        content={'content' in sections[0] ? sections[0].content : 'Content not available'}
                    />
                </div>
                <Details
                    date={date}
                    state={state}
                    category={category}
                    department={department}
                    source={source}
                    lan={lan}
                />
                <div className='w-full block xl:hidden'>
                    <TextDiv
                        heading={sections[0].heading}
                        content={'content' in sections[0] ? sections[0].content : 'Content not available'}
                    />
                </div>
            </div>
            <TextDiv
                heading={sections[1].heading}
                content={'content' in sections[1] ? sections[1].content : 'Content not available'}
            />
            <KeyInforMation
                heading={sections[2].heading}
                points={'points' in sections[2] ? sections[2].points : []}
            />
            <Title
                title='More Like this'
            />
        </section>
    )
}

export default ShowAnnouncement