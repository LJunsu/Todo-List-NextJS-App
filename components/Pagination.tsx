import { useEffect, useState } from "react";

type PaginationProps = {
    totalPage: number;
    limit: number;
    page: number;
    setPage: (page: number) => void;
}
export function Pagination({totalPage, limit, page, setPage}: PaginationProps) {
    const [totalPageArray, setTotalPageArray] = useState<number[][]>([]);
    const [currentPageArray, setCurrentPageArray] = useState<number[]>([]);

    useEffect(() => {
        if(page % limit === 0) {
            setCurrentPageArray(totalPageArray[Math.floor(page / limit) - 1]);
        } else {
            setCurrentPageArray(totalPageArray[Math.floor(page / limit)]);
        }
    }, [page]);

    useEffect(() => {
        const slicedPageArray = sliceArrayByLimit(totalPage, limit);
        setTotalPageArray(slicedPageArray);
        setCurrentPageArray(slicedPageArray[0]);
    }, [totalPage]);

    return (
        <div className="flex justify-center gap-4 w-full *:cursor-pointer *:select-none">
            <div className="flex gap-2">
                <div className={`${page === 1 && "text-gray-300"}`} onClick={() => {if(page !== 1) setPage(1)}}>&lt;&lt;</div>
                <div className={`${page === 1 && "text-gray-300"}`} onClick={() => {if(page !== 1) setPage(page - 1)}}>&lt;</div>
            </div>

            {currentPageArray?.map((index) => (
                <div key={index} className={`${(page - 1) === index && "text-[#366EDD] border-b-2 border-[#366EDD]"}`} onClick={() => setPage(index + 1)}>{index + 1}</div>
            ))}

            <div className="flex gap-2">
                <div className={`${page === totalPage && "text-gray-300"}`} onClick={() => {if(page !== totalPage) setPage(page + 1)}}>&gt;</div>
                <div className={`${page === totalPage && "text-gray-300"}`} onClick={() => {if(page !== totalPage) setPage(totalPage)}}>&gt;&gt;</div>
            </div>
        </div>
    );
}

export const sliceArrayByLimit = (totalPage: number, limit: number) => {
    const totalPageArray = Array(totalPage).fill(0).map((_, index) => index);
    return Array(Math.ceil(totalPage / limit)).fill(0).map(() => totalPageArray.splice(0, limit));
}