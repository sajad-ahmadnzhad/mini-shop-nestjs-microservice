import { Action } from "../../../common/enums/action.enum"
import { Resource } from "../../../common/enums/resource.enum"
import { User } from "../../../modules/auth/entities/user.entity"

export interface IRole {
    name: string
}

export interface IAssignRole {
    roleId: number
    userId: number
}

export interface IGetOneRole {
    id: number
}

export interface IUpdateRole extends Partial<IRole>, IGetOneRole { }

export interface IRemoveRole extends IGetOneRole { }

export interface IAccessPermission {
    user: User
    action: Action
    resource: Resource
}