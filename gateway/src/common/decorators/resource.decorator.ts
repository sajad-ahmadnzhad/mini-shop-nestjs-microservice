import { SetMetadata } from "@nestjs/common"
import { Resource as ResourceEnums } from "src/modules/app/enums/user.enum"

export const RESOURCES_KEY = 'resources'

export const Resource = (...resource: ResourceEnums[]) => SetMetadata(RESOURCES_KEY, resource)