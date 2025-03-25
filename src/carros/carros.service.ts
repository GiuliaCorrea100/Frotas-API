import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, CarrosDto } from './carros.dto';

@Injectable()
export class CarrosService {
  private carros: CarrosDto[] = [];

  create(carros: CarrosDto) {
    this.carros.push(carros);
    console.log(this.carros);
  }

  findById(id: string): CarrosDto {
    const foundCarro = this.carros.filter((c) => c.id === id);

    if (foundCarro.length) {
      return foundCarro[0];
    }
    throw new NotFoundException(`Item with id ${id} not found`);
  }

  findAll(params: FindAllParameters): CarrosDto[] {
    return this.carros.filter((c) => {
      let match = true;

      if (params.modelo != undefined && !c.modelo.includes(params.modelo)) {
        match = false;
      }
      if (params.ano != undefined && !c.ano.includes(params.ano)) {
        match = false;
      }
      return match;
    });
  }

  update(carros: CarrosDto) {
    //let carrosIndex
    const carrosIndex = this.carros.findIndex((c) => c.id === carros.id);

    if (carrosIndex >= 0) {
      this.carros[carrosIndex] = carros;
      return;
    }
    throw new HttpException(
      `Item with id ${carros.id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: string) {
    //let carrosIndex
    const carrosIndex = this.carros.findIndex((c) => c.id === id);

    if (carrosIndex >= 0) {
      this.carros.splice(carrosIndex, 1);
      return;
    }
    throw new HttpException(
      `Item with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
