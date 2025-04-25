import { Subscription } from "rxjs";

export interface BlogDetailsModel {
    sub: Subscription |null,
    error: string |null,
    loading: boolean,
    blogId: string |null,
    data: any
}
