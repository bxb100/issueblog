import {Issue} from "../clazz/issue";
import {IssuesKit} from "../clazz/issue-kit";

export type ProcessFunction<T> = (this: IssuesKit<T>, issues: Issue[]) => Promise<void>
