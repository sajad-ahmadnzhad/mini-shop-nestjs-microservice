import { SetMetadata } from "@nestjs/common"
import { Action as ActionEnum } from "../../modules/app/enums/user.enum"

export const ACTION_KEY = 'action'

export const Action = (action: ActionEnum) => SetMetadata(ACTION_KEY, action);