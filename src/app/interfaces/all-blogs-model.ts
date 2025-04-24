import { Subscription } from "rxjs";

export interface AllBlogsModel {
    sub: Subscription|null,
    error: string |null,
    loading: boolean,
    items: any[],
    totalBlogs: number,
    totalPages: number[],
    currentPage: number
}
