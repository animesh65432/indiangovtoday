import React from 'react'
import Search from '@/components/Search'
import { useSearchParams } from 'next/navigation'

const SearchPage = () => {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const states = searchParams.getAll('states')

    return (
        <Search
            query={query}
            startdate={startDate}
            enddate={endDate}
            states={states}
        />
    )
}

export default SearchPage