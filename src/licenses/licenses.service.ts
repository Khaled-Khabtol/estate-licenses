import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './entities/licenses.entity';
import { Repository } from 'typeorm';
import { CreateLicenseDto } from './dto/create-license.dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto/update-license.dto';
import { QrCodeService } from 'src/qrcode/qr-code.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LicensesService {

    constructor(@InjectRepository(License) private readonly licensesRep: Repository<License>,
        private readonly qrCodeService: QrCodeService, private readonly configService: ConfigService) { }

    async findAll(): Promise<License[]> {
        return this.licensesRep.find();
    }

    async findOne(id: number): Promise<License> {
        const license = await this.licensesRep.findOne({
            where: { id }
        });

        if (!license)
            throw new NotFoundException(`id ${id} doesn't exists`);

        return license;
    }

    async create(dto: CreateLicenseDto) {
        const license = this.licensesRep.create({
            ...dto
        })

        const HOST_IP = this.configService.get<string>('HOST_IP');

        const newLicense = await this.licensesRep.save(license);
        const outputPath = `images/${newLicense.id}_qrcode.png`;
        const imageUrl = await this.qrCodeService.generateQrCode(`${HOST_IP}/images/${newLicense.id}`, outputPath);

        newLicense.qrcode_url = `${HOST_IP}/${imageUrl}`;
        return this.licensesRep.save(newLicense);
    }

    async update(id: string, dto: UpdateLicenseDto) {
        const updateLicense = await this.licensesRep.preload({
            id: +id,
            ...dto
        })

        if (!updateLicense)
            throw new NotFoundException(`License with id ${id} doesn't exists`);

        return this.licensesRep.save(updateLicense);
    }

    async remove(id: string) {
        const deleteLicense = await this.licensesRep.delete(id);

        if (deleteLicense.affected === 0)
            throw new NotFoundException(`License with id ${id} doesn't exists`);

        return { "message": `License with id ${id} Deleted Successfully` };
    }

}
