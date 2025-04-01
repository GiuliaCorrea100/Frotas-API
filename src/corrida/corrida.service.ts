import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CorridaDto, FindAllParameters } from './corrida.dto';

@Injectable()
export class CorridaService {
  private corrida: CorridaDto[] = [];

  create(corrida: CorridaDto) {
    this.corrida.push(corrida);
    console.log(this.corrida);
  }

  findById(id: string): CorridaDto {
    const foundCorrida = this.corrida.filter((c) => c.id === id);

    if (foundCorrida.length) {
      return foundCorrida[0];
    }
    throw new NotFoundException(`Item with id ${id} not found`);
  }

  findAll(params: FindAllParameters): CorridaDto[] {
    return this.corrida.filter((c) => {
      let match = true;

      if (
        params.itinerario != undefined &&
        !c.itinerario.includes(params.itinerario)
      ) {
        match = false;
      }
      return match;
    });
  }

  update(corrida: CorridaDto) {
    //let carrosIndex
    const corridaIndex = this.corrida.findIndex((c) => c.id === corrida.id);

    if (corridaIndex >= 0) {
      this.corrida[corridaIndex] = corrida;
      return;
    }
    throw new HttpException(
      `Item with id ${corrida.id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: string) {
    //let carrosIndex
    const corridaIndex = this.corrida.findIndex((c) => c.id === id);

    if (corridaIndex >= 0) {
      this.corrida.splice(corridaIndex, 1);
      return;
    }
    throw new HttpException(
      `Item with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
