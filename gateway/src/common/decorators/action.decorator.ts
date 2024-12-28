import { SetMetadata } from "@nestjs/common"
import { Action as ActionEnum } from "../../modules/app/enums/user.enum"

export const ACTIONS_KEY = 'actions'

export const Action = (...actions: ActionEnum[]) => SetMetadata(ACTIONS_KEY, actions);