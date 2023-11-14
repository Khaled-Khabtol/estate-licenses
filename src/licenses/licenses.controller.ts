import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { CreateLicenseDto } from './dto/create-license.dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto/update-license.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('licenses')
export class LicensesController {

    constructor(private readonly licensesService: LicensesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    create(@Body() body: CreateLicenseDto) {
        return this.licensesService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.licensesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.licensesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() body: UpdateLicenseDto) {
        return this.licensesService.update(id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.licensesService.remove(id);
    }

}
