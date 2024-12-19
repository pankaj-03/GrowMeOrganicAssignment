import axios from "axios";
import { useEffect, useState } from "react"

interface TableDataInterface {
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions?: string | null;
    date_start: number;
    date_end: number;
    index: number
};

interface ApiResponseInterface {

    pagination: {
        total: number;
        limit: number;
        offset: number;
        total_pages: number;
        current_page: number;
        prev_url: string;
        next_url: string;
    };
    data: Array<{
        id: number;
        title: string;
        date_start: number;
        date_end: number;
        artist_display: string;
        place_of_origin: string;
        inscriptions?: string;
    }>

};
export const useApi = (currentPage: number) => {
    const [data, setData] = useState<TableDataInterface[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);  //for total pages
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false); 
    const url = import.meta.env.VITE_API_URL;

    const currentURL = `${url}$?page=${currentPage}`;
    const { checkedRanges, handleCheck, handleRemove } = useCheckbox()
    useEffect(() => {
        const source = axios.CancelToken.source(); // Create a cancel token
        ; (async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await axios.get<ApiResponseInterface>(`${url}?page=${currentPage}`, {
                    cancelToken: source.token // Attach the cancel token
                });
                // console.log(response);
                // const extractedData = response.data.pagination;
                // console.log(extractedData);
                const extractedData = response.data.data.map((item, idx) => ({
                    title: item.title,
                    place_of_origin: item.place_of_origin,
                    artist_display: item.artist_display,
                    inscriptions: item.inscriptions || null,
                    date_start: item.date_start,
                    date_end: item.date_end,
                    index: (currentPage - 1) * 12 + idx,

                }));
                console.log(extractedData)
                setData(extractedData);
                setTotalRecords(response.data.pagination.total_pages); // Total records for pagination
                console.log(response.data.pagination.total_pages)
                setLoading(false);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message); // Handle cancellation
                }
                else {
                    setError(true);
                    console.log(error);
                }

            }
            finally {
                setLoading(false)
            }
        })()

        return () => {
            source.cancel('Operation canceled by the user.');
        };
    }, [currentPage, url]); //cancel prev api

    // console.log(data.map((d) => checkedRanges.includes(d.index)), "------------logging")
    return { totalRecords, data: data.map((d) => { return { ...d, isChecked: checkedRanges.includes(d.index) } }), error, loading, handleCheck, handleRemove }
}


export const useCheckbox = () => {
    const [checkedRanges, setCheckedRanges] = useState<Array<number>>([])

    // console.log(checkedRanges, "---------------checked ranges")
    const handleCheck = (start: number, end: number) => {
        for (let i = start; i <= end; i++) {
            if (!checkedRanges.includes(i)) {
                setCheckedRanges((prev) => [...prev, i])
            }
        }
    }

    const handleRemove = (index: number) => {
        if (checkedRanges.includes(index)) setCheckedRanges(prev => prev.filter(p => p !== index))
    }
    const isChecked = (index: number) => {
        return checkedRanges.includes(index);
    }
    return { handleCheck, isChecked, checkedRanges, handleRemove }

}
// [{1,1},{3,5},{7,7},{9,9}]
