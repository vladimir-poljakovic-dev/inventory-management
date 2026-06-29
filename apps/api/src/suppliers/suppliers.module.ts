import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { SupplierService } from './suppliers.service';
import { Supplier } from './supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SuppliersController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SuppliersModule {}