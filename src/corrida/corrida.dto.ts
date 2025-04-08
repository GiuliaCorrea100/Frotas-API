export class CorridaDto {
  id: number;
  data_inicio: Date;
  data_termino: Date;
  distancia_km: string;
  itinerario: string;
}

export interface FindAllParameters {
  itinerario: string;
}
