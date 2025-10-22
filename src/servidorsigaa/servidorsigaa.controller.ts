/* eslint-disable prettier/prettier */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ServidorsigaaService } from './servidorsigaa.service';
import { ServidorSigaaDto } from './servidorsigaa.dto';

@UseGuards(AuthGuard)
@Controller('servidorsigaa')
export class ServidorsigaaController {
    constructor(private readonly sigaaServidorService: ServidorsigaaService){}

    @Get('/:id')
    async findById(@Param('id') id: number): Promise<ServidorSigaaDto> {
        return await this.sigaaServidorService.findById(id);
    }

  
}
