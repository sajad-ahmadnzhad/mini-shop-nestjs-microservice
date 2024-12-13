import { Action } from "../../../common/enums/action.enum";
import { Resource } from "../../../common/enums/resource.enum";

export interface IPermission {
    resource: Resource
    actions: Action[]
}