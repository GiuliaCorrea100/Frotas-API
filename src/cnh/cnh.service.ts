import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, CnhDto } from './cnh.dto';

@Injectable()
export class CnhService {
  private cnh: CnhDto[] = [];

  create(cnh: CnhDto) {
    this.cnh.push(cnh);
    console.log(this.cnh);
  }

  findById(id: number): CnhDto {
    const foundCnh = this.cnh.filter((c) => c.idCnh === id);

    if (foundCnh.length) {
      return foundCnh[0];
    }

    throw new NotFoundException(`Item with id ${id} not found`);
  }

  findAll(params: FindAllParameters): CnhDto[] {
    return this.cnh.filter((c) => {
      let match = true;

      if (
        params.classificacao != undefined &&
        !c.classificacao.includes(params.classificacao)
      ) {
        match = false;
      }

      if (
        params.dataValidade !== undefined &&
        c.dataValidade.getDate() !== params.dataValidade.getDate()
      ) {
        match = false;
      }

      if (params.nome != undefined && !c.nome.includes(params.nome)) {
        match = false;
      }

      return match;
    });
  }

  update(cnh: CnhDto) {
    const cnhIndex = this.cnh.findIndex((c) => c.idCnh === cnh.idCnh);

    if (cnhIndex >= 0) {
      this.cnh[cnhIndex] = cnh;
      return;
    }
    throw new HttpException(
      `Item with id ${cnh.idCnh} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: number) {
    const cnhIndex = this.cnh.findIndex((c) => c.idCnh === id);

    if (cnhIndex >= 0) {
      this.cnh.splice(cnhIndex, 1);
      return;
    }
    throw new HttpException(
      `Item with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
