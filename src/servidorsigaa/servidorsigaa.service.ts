/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServidorSigaaEntity } from 'src/dbsigaa/entities/servidorsigaa.entity';
import { Repository } from 'typeorm';
import { ServidorSigaaDto } from './servidorsigaa.dto';

@Injectable()
export class ServidorsigaaService {
    constructor(
        @InjectRepository(ServidorSigaaEntity, 'sigaaConnection')
        private readonly servidorRepository: Repository<ServidorSigaaEntity>
    ){}

    async findById(id: number): Promise<ServidorSigaaDto> {
        const servidorFound = await this.servidorRepository.findOne({
            where: {
                idServidor: id
            }
        })

        if (!servidorFound) {
            throw new HttpException(
                `Servidor com idPessoa ${id} não encontrado`,
                HttpStatus.NOT_FOUND
            )
        }

        return this.mapEntityToDto(servidorFound);
    }

    private mapEntityToDto(servidorEntity: ServidorSigaaEntity): ServidorSigaaDto{
        return {
            idServidor: servidorEntity.idServidor,
            idPessoa: servidorEntity.idPessoa,
        }
    }
}
