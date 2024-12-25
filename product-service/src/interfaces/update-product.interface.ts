import { ICreateProduct } from "./create-product.interface";
import { IRemoveProduct } from "./remove-product.interface";

export interface IUpdateProduct extends Omit<Partial<ICreateProduct>, 'creatorId'>, IRemoveProduct { }