import { SetMetadata } from "@nestjs/common"
import { Resource as ResourceEnums } from "../../modules/app/enums/user.enum"

export const RESOURCE_KEY = 'resource'

export const Resource = (resource: ResourceEnums) => SetMetadata(RESOURCE_KEY, resource)