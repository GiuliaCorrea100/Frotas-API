import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MultasDto, FindAllParameters } from './multas.dto';

@Injectable()
export class MultasService {
  private multas: MultasDto[] = [];

  create(multas: MultasDto) {
    this.multas.push(multas);
    console.log(this.multas);
  }

  findByAutoInfracao(num_auto_infracao: string): MultasDto {
    const foundMulta = this.multas.filter(
      (m) => m.num_auto_infracao === num_auto_infracao,
    );

    if (foundMulta.length) {
      return foundMulta[0];
    }

    throw new NotFoundException(`Item with id ${num_auto_infracao} not found`);
  }

  findAll(params: FindAllParameters): MultasDto[] {
    return this.multas.filter((c) => {
      let match = true;

      if (
        params.cod_infracao != undefined &&
        !c.cod_infracao.includes(params.cod_infracao)
      ) {
        match = false;
      }

      if (
        params.class_infracao != undefined &&
        !c.class_infracao.includes(params.class_infracao)
      ) {
        match = false;
      }

      if (params.valor != undefined && !c.valor.includes(params.valor)) {
        match = false;
      }

      return match;
    });
  }

  update(multas: MultasDto) {
    const multasIndex = this.multas.findIndex(
      (m) => m.num_auto_infracao === multas.num_auto_infracao,
    );

    if (multasIndex >= 0) {
      this.multas[multasIndex] = multas;
      return;
    }
    throw new HttpException(
      `Item with id ${multas.num_auto_infracao} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(num_auto_infracao: string) {
    const cnhIndex = this.multas.findIndex(
      (m) => m.num_auto_infracao === num_auto_infracao,
    );

    if (cnhIndex >= 0) {
      this.multas.splice(cnhIndex, 1);
      return;
    }
    throw new HttpException(
      `Item with id ${num_auto_infracao} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
