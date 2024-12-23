import { IPermission } from "./permission.interface"

export interface IRole {
    name: string
    permissions: IPermission[]
}


export interface IAssignRole {
    roleId: number
    userId: number
}