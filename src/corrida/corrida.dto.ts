export class CorridaDto {
  id: string;
  data_inicio: Date;
  hr_inicio: string;
  hr_termino: string;
  data_termino: string;
  distancia_km: string;
  itinerario: string;
}

export interface FindAllParameters {
  itinerario: string;
}
