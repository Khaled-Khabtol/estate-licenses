import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './entities/licenses.entity';
import { Repository } from 'typeorm';
import { CreateLicenseDto } from './dto/create-license.dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto/update-license.dto';
import { QrCodeService } from 'src/qrcode/qr-code.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';

@Injectable()
export class LicensesService {

    constructor(@InjectRepository(License) private readonly licensesRep: Repository<License>,
        private readonly configService: ConfigService, private readonly qrCodeService: QrCodeService) { }

    async findAll(page: number, limit: number) {
        const licensesCount = await this.licensesRep.count();
        const licenses = await this.findWithPagination(page, limit);
        return { licenses, page, licensesCount };
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
        const imageUrl = await this.qrCodeService.generateQrCode(`${HOST_IP}/licenses/${newLicense.id}`, outputPath);

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

        this.deleteFile(`${id}_qrcode.png`);
        return { "message": `License with id ${id} Deleted Successfully` };
    }

    async deleteFile(filename: string) {
        try {
            const filePath = `images/${filename}`;
            await fs.unlink(filePath);
        } catch (error) {
            console.error(`Error deleting file ${filename}:`, error.message);
            throw new Error(`Error deleting file ${filename}`);
        }
    }

    async findWithPagination(page: number = 1, limit: number = 9): Promise<License[]> {
        const skip = (page - 1) * limit;

        return await this.licensesRep.find({
            skip,
            take: limit,
        });
    }

}
