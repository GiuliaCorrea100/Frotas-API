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

  findById(id: number): AbastecimentoDto {
    const foundAbastecimento = this.abastecimento.filter(
      (a) => a.idAbastecimento === id,
    );

    if (foundAbastecimento.length) {
      return foundAbastecimento[0];
    }

    throw new NotFoundException(`Item with id ${id} not found`);
  }

  findAll(params: FindAllParameters): AbastecimentoDto[] {
    return this.abastecimento.filter((c) => {
      let match = true;

      if (
        params.tipoCombustivel != undefined &&
        !c.tipoCombustivel.includes(params.tipoCombustivel)
      ) {
        match = false;
      }

      if (
        params.dataAbastecimento !== undefined &&
        c.dataAbastecimento.getTime() !== params.dataAbastecimento.getTime()
      ) {
        match = false;
      }

      return match;
    });
  }

  update(abastecimento: AbastecimentoDto) {
    const abastecimentoIndex = this.abastecimento.findIndex(
      (a) => a.idAbastecimento === abastecimento.idAbastecimento,
    );

    if (abastecimentoIndex >= 0) {
      this.abastecimento[abastecimentoIndex] = abastecimento;
      return;
    }
    throw new HttpException(
      `Item with id ${abastecimento.idAbastecimento} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: number) {
    const abastecimentoIndex = this.abastecimento.findIndex(
      (a) => a.idAbastecimento === id,
    );

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
