import { useEffect, useState } from "react";

type PaginationProps = {
    totalPage: number;
    limit: number;
    page: number;
    setPage: (page: number) => void;
}
/*
    totalPage - 전체 페이지 수
    limit - 한 페이지에 표시할 항목 수
    page - 현재 페이지
    setPage - 페이지를 변경하는 함수
*/
export function Pagination({totalPage, limit, page, setPage}: PaginationProps) {
    // 전체 페이지를 limit에 맞춰 나눈 배열, 각 페이지 그룹을 나누어 저장
    const [totalPageArray, setTotalPageArray] = useState<number[][]>([]);
    // 현재 페이지에서 보여줄 페이지 배열, limit 만큼 현재 페이지에 해당하는 페이지 번호를 저장
    const [currentPageArray, setCurrentPageArray] = useState<number[]>([]);

    // totalPageArray에서 적절한 페이지 그룹을 찾아 currentPageArray에 저장
    useEffect(() => {
        /*
            현재 페이지가 그룹의 끝에 해당하므로, page가 마지막 번호일 때 그 이전 그룹을 선택
        
            5 % 5 === 0 ->  Math.floor(5 / 5) - 1 = 0   -> 0번 그룹 ([0, 1, 2, 3, 4])
            6 % 5 !== 0 ->  Math.floor(6 / 5) = 1       -> 1번 그룹 ([5, 6, 7, 8, 9])
            10 % 5 === 0 -> Math.floor(10 / 5) - 1 = 1  -> 1번 그룹 ([5, 6, 7, 8, 9])
        */
        if(page % limit === 0) {
            setCurrentPageArray(totalPageArray[Math.floor(page / limit) - 1]);
        } else { // 현재 페이지가 속한 그룹을 선택
            setCurrentPageArray(totalPageArray[Math.floor(page / limit)]);
        }
    }, [page]); // page 변경 시 수행

    // sliceArrayByLimit 함수를 호출하여 전체 페이지를 limit에 맞게 그룹화한 후 
    // totalPageArray와 currentPageArray를 업데이트
    useEffect(() => {
        const slicedPageArray = sliceArrayByLimit(totalPage, limit);
        setTotalPageArray(slicedPageArray);
        setCurrentPageArray(slicedPageArray[0]);
    }, [totalPage]); // totalPage 변경 시 수행

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

// 전체 페이지 수(totalPage)와 페이지에 표시할 항목 수(limit)를 받아,
// 전체 페이지를 그룹화하여 2차원 배열로 반환
export const sliceArrayByLimit = (totalPage: number, limit: number) => {
    // 전체 페이지를 나눈 배열 - [0, 1, 2, 3, 4, 5, 6, 7]
    const totalPageArray = Array(totalPage).fill(0).map((_, index) => index);

    // 배열을 limit 값에 맞게 잘라서 반환 - [[0, 1, 2, 3, 4], [5, 6, 7]]
    return Array(Math.ceil(totalPage / limit)).fill(0).map(() => totalPageArray.splice(0, limit));
}