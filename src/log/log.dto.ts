export class LogDto {
  nomeTabela: string;
  idRegistro: number;
  operacao: 'INSERT' | 'UPDATE' | 'DELETE';
  dadosAntigos?: any;
  dadosNovos?: any;
  idUsuario?: number;
  usuario?: string;
}
