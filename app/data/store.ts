import path from "path"; // OS에 따라 파일 경로 생성
import fs from 'fs/promises'; // 파일 읽기/쓰기 작업을 비동기 방식으로 처리

// process.cwd() -> 현재 프로젝트의 루트 디렉토리
// /todo_list_nexts_app/app/data/db.json
// dbPath -> JSON 파일의 절대경로
const dbPath = path.join(process.cwd(), "app", "data", "db.json");

export type TodoType = {
    id: number;
    content: string;
    completed: boolean;
    date: string;
}

// db.json 파일의 데이터를 읽어 배열로 반환
export async function getItems(): Promise<TodoType[]> {
    // 파일 내용을 문자열로 읽고, utf-8로 인코딩
    const file = await fs.readFile(dbPath, "utf-8"); // string[]
    return JSON.parse(file); // 문자열을 JS 배열로 변환 후 반환
}

// db.json 파일의 데이터를 읽어 completed인 데이터를 배열로 반환
export async function getCompletedItems(): Promise<TodoType[]> {
    const items = await getItems();
    const newItems = items.filter((item) => item.completed);
    return newItems;
}

// db.json 파일의 데이터를 읽어 completed이 false인 데이터를 배열로 반환
export async function getActiveItems(): Promise<TodoType[]> {
    const items = await getItems();
    const newItems = items.filter((item) => !item.completed);
    return newItems;
}

// db.json 파일에 새로운 데이터를 추가 후 저장
export async function addItem(content: string): Promise<number> {
    const items = await getItems(); // 기존 파일의 데이터 반환

    const newItem = {
        id: items.length,
        content: content,
        completed: false,
        date: new Date().toISOString()
    }

    items.push(newItem); // 배열에 새로운 데이터 추가
    // 데이터를 추가한 배열을 db.json 파일에 덮어 씌워 저장
    await fs.writeFile(dbPath, JSON.stringify(items, null, 2)); // null, 2는 들여쓰기 관련 설정

    return newItem.id;
}

// dn.json 파일에 인덱스의 completed 값을 반전 후 저장
export async function completedItem(indexs: number[]): Promise<void> {
    const items = await getItems();
    // 사용자가 선택한 todo의 id 배열(indexs)을 순회하며 해당 id의 todo를 items 배열에서 찾아 completed 값을 반전
    indexs.map((id) => {
        let newIndex = items.find(item => item.id === id); // items 배열에서 id와 동일한 id를 가지고 있는 item을 반환
        if(newIndex) newIndex.completed = !newIndex.completed;
    });
    await fs.writeFile(dbPath, JSON.stringify(items, null, 2));
}

// db.json 파일에 인덱스의 데이터를 삭제한 후 저장
export async function removeItem(indexs: number[]): Promise<void> {
    const items = await getItems(); // 기존 파일의 데이터 반환
    // 기존 파일의 데이터 배열(items)에 사용자가 선택한 인덱스의 배열(indexs)를 제외한 새로운 배열 생성
    const newItems = items.filter((item) => !indexs.includes(item.id)); // items 배열에서 indexs 배열에 없는 id를 가진 todo만 반환 = indexs 배열에 있는 값을 제외한 나머지 값
    await fs.writeFile(dbPath, JSON.stringify(newItems, null, 2));
}