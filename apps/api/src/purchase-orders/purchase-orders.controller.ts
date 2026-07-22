import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreatePurchaseOrderDto, ReceivePurchaseOrderDto, Role } from '@repo/types';
import { Roles } from '../common/decorators/roles.decorator';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrder } from './purchase-order.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.create(dto);
  }

  @Patch(':id/receive')
  @Roles(Role.Admin)
  receive(
    @Param('id') id: string,
    @Body() dto: ReceivePurchaseOrderDto,
    @CurrentUser('id') userId: string,
  ): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.receive(id, dto, userId);
  }
}