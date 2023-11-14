import { Module } from '@nestjs/common';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './entities/licenses.entity';
import { QrCodeService } from 'src/qrcode/qr-code.service';

@Module({
    imports: [TypeOrmModule.forFeature([License])],
    controllers: [LicensesController],
    providers: [LicensesService, QrCodeService],
})
export class LicensesModule { }
