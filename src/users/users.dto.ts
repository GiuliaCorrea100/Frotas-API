export class UsersDto {
  id: string;
  username: string;
  password: string;
  permissao: string; //1-adm 2-motorista
}

export interface FindAllParameters {
  permissao: string;
}
