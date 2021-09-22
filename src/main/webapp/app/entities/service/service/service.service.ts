import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IService, getServiceIdentifier } from '../service.model';

export type EntityResponseType = HttpResponse<IService>;
export type EntityArrayResponseType = HttpResponse<IService[]>;

@Injectable({ providedIn: 'root' })
export class ServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/services');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(service: IService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(service);
    return this.http
      .post<IService>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(service: IService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(service);
    return this.http
      .put<IService>(`${this.resourceUrl}/${getServiceIdentifier(service) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(service: IService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(service);
    return this.http
      .patch<IService>(`${this.resourceUrl}/${getServiceIdentifier(service) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IService>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IService[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addServiceToCollectionIfMissing(serviceCollection: IService[], ...servicesToCheck: (IService | null | undefined)[]): IService[] {
    const services: IService[] = servicesToCheck.filter(isPresent);
    if (services.length > 0) {
      const serviceCollectionIdentifiers = serviceCollection.map(serviceItem => getServiceIdentifier(serviceItem)!);
      const servicesToAdd = services.filter(serviceItem => {
        const serviceIdentifier = getServiceIdentifier(serviceItem);
        if (serviceIdentifier == null || serviceCollectionIdentifiers.includes(serviceIdentifier)) {
          return false;
        }
        serviceCollectionIdentifiers.push(serviceIdentifier);
        return true;
      });
      return [...servicesToAdd, ...serviceCollection];
    }
    return serviceCollection;
  }

  protected convertDateFromClient(service: IService): IService {
    return Object.assign({}, service, {
      created: service.created?.isValid() ? service.created.toJSON() : undefined,
      updated: service.updated?.isValid() ? service.updated.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
      res.body.updated = res.body.updated ? dayjs(res.body.updated) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((service: IService) => {
        service.created = service.created ? dayjs(service.created) : undefined;
        service.updated = service.updated ? dayjs(service.updated) : undefined;
      });
    }
    return res;
  }
}
