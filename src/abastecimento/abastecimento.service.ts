import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbastecimentoDto, FindAllParameters } from './abastecimento.dto';

@Injectable()
export class AbastecimentoService {
  private abastecimento: AbastecimentoDto[] = [];

  create(abastecimento: AbastecimentoDto) {
    this.abastecimento.push(abastecimento);
    console.log(this.abastecimento);
  }

  findById(id: string): AbastecimentoDto {
    const foundAbastecimento = this.abastecimento.filter((a) => a.id === id);

    if (foundAbastecimento.length) {
      return foundAbastecimento[0];
    }

    throw new NotFoundException(`Item with id ${id} not found`);
  }

  findAll(params: FindAllParameters): AbastecimentoDto[] {
    return this.abastecimento.filter((c) => {
      let match = true;

      if (
        params.tipo_combustivel != undefined &&
        !c.tipo_combustivel.includes(params.tipo_combustivel)
      ) {
        match = false;
      }

      /*if (
        params.data_abastecimento != undefined &&
        !c.data_abastecimento.includes(params.data_abastecimento)
      ) {
        match = false;
      }*/

      return match;
    });
  }

  update(abastecimento: AbastecimentoDto) {
    const abastecimentoIndex = this.abastecimento.findIndex(
      (a) => a.id === abastecimento.id,
    );

    if (abastecimentoIndex >= 0) {
      this.abastecimento[abastecimentoIndex] = abastecimento;
      return;
    }
    throw new HttpException(
      `Item with id ${abastecimento.id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: string) {
    const abastecimentoIndex = this.abastecimento.findIndex((a) => a.id === id);

    if (abastecimentoIndex >= 0) {
      this.abastecimento.splice(abastecimentoIndex, 1);
      return;
    }
    throw new HttpException(
      `Item with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
