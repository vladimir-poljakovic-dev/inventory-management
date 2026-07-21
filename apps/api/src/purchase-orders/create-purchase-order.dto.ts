import { Type } from 'class-transformer';
import { ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { CreatePurchaseOrderDto, CreatePurchaseOrderItemDto } from '@repo/types';

export class CreatePurchaseOrderRequest extends CreatePurchaseOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  declare items: CreatePurchaseOrderItemDto[];
}