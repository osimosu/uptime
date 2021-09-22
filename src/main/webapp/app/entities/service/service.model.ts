import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IService {
  id?: number;
  status?: Status | null;
  name?: string;
  url?: string;
  created?: dayjs.Dayjs;
  updated?: dayjs.Dayjs;
  user?: IUser;
}

export class Service implements IService {
  constructor(
    public id?: number,
    public status?: Status | null,
    public name?: string,
    public url?: string,
    public created?: dayjs.Dayjs,
    public updated?: dayjs.Dayjs,
    public user?: IUser
  ) {}
}

export function getServiceIdentifier(service: IService): number | undefined {
  return service.id;
}
