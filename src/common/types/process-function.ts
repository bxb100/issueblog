import {Issue} from "../clazz/issue";
import {GithubKit} from "../clazz/github-kit";

export type ProcessFunction<T> = (this: GithubKit<T>, issues: Issue[]) => Promise<void>
