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

export interface IUpdateRole extends Partial<IRole>, IGetOneRole {}