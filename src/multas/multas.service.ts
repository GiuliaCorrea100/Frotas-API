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

  findById(id: number): MultasDto {
    const foundMulta = this.multas.filter((c) => c.idMultas === id);

    if (foundMulta.length) {
      return foundMulta[0];
    }

    throw new NotFoundException(`Item with id ${id} not found`);
  }

  findAll(params: FindAllParameters): MultasDto[] {
    return this.multas.filter((c) => {
      let match = true;

      if (
        params.codInfracao != undefined &&
        !c.codInfracao.includes(params.codInfracao)
      ) {
        match = false;
      }

      if (
        params.classInfracao != undefined &&
        !c.classInfracao.includes(params.classInfracao)
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
      (m) => m.idMultas === multas.idMultas,
    );

    if (multasIndex >= 0) {
      this.multas[multasIndex] = multas;
      return;
    }
    throw new HttpException(
      `Item with id ${multas.idMultas} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: number) {
    const multasIndex = this.multas.findIndex((m) => m.idMultas === id);

    if (multasIndex >= 0) {
      this.multas.splice(multasIndex, 1);
      return;
    }
    throw new HttpException(
      `Item with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
