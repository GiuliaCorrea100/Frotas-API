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

  findByRg(rg: string): CnhDto {
    const foundCnh = this.cnh.filter((c) => c.rg === rg);

    if (foundCnh.length) {
      return foundCnh[0];
    }

    throw new NotFoundException(`Item with id ${rg} not found`);
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

      /*if (
        params.data_validade != undefined &&
        !c.data_validade.includes(params.data_validade)
      ) {
        match = false;
      }*/

      if (params.nome != undefined && !c.nome.includes(params.nome)) {
        match = false;
      }

      if (
        params.sobrenome != undefined &&
        !c.sobrenome.includes(params.sobrenome)
      ) {
        match = false;
      }

      return match;
    });
  }

  update(cnh: CnhDto) {
    const cnhIndex = this.cnh.findIndex((c) => c.rg === cnh.rg);

    if (cnhIndex >= 0) {
      this.cnh[cnhIndex] = cnh;
      return;
    }
    throw new HttpException(
      `Item with id ${cnh.rg} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(rg: string) {
    const cnhIndex = this.cnh.findIndex((c) => c.rg === rg);

    if (cnhIndex >= 0) {
      this.cnh.splice(cnhIndex, 1);
      return;
    }
    throw new HttpException(
      `Item with id ${rg} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
