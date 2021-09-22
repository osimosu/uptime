import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Status } from 'app/entities/enumerations/status.model';
import { IService, Service } from '../service.model';

import { ServiceService } from './service.service';

describe('Service Tests', () => {
  describe('Service Service', () => {
    let service: ServiceService;
    let httpMock: HttpTestingController;
    let elemDefault: IService;
    let expectedResult: IService | IService[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ServiceService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        status: Status.OK,
        name: 'AAAAAAA',
        url: 'AAAAAAA',
        created: currentDate,
        updated: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            created: currentDate.format(DATE_TIME_FORMAT),
            updated: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Service', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            created: currentDate.format(DATE_TIME_FORMAT),
            updated: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created: currentDate,
            updated: currentDate,
          },
          returnedFromService
        );

        service.create(new Service()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Service', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            status: 'BBBBBB',
            name: 'BBBBBB',
            url: 'BBBBBB',
            created: currentDate.format(DATE_TIME_FORMAT),
            updated: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created: currentDate,
            updated: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Service', () => {
        const patchObject = Object.assign(
          {
            url: 'BBBBBB',
            updated: currentDate.format(DATE_TIME_FORMAT),
          },
          new Service()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            created: currentDate,
            updated: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Service', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            status: 'BBBBBB',
            name: 'BBBBBB',
            url: 'BBBBBB',
            created: currentDate.format(DATE_TIME_FORMAT),
            updated: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created: currentDate,
            updated: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Service', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addServiceToCollectionIfMissing', () => {
        it('should add a Service to an empty array', () => {
          const service: IService = { id: 123 };
          expectedResult = service.addServiceToCollectionIfMissing([], service);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(service);
        });

        it('should not add a Service to an array that contains it', () => {
          const service: IService = { id: 123 };
          const serviceCollection: IService[] = [
            {
              ...service,
            },
            { id: 456 },
          ];
          expectedResult = service.addServiceToCollectionIfMissing(serviceCollection, service);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Service to an array that doesn't contain it", () => {
          const service: IService = { id: 123 };
          const serviceCollection: IService[] = [{ id: 456 }];
          expectedResult = service.addServiceToCollectionIfMissing(serviceCollection, service);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(service);
        });

        it('should add only unique Service to an array', () => {
          const serviceArray: IService[] = [{ id: 123 }, { id: 456 }, { id: 30617 }];
          const serviceCollection: IService[] = [{ id: 123 }];
          expectedResult = service.addServiceToCollectionIfMissing(serviceCollection, ...serviceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const service: IService = { id: 123 };
          const service2: IService = { id: 456 };
          expectedResult = service.addServiceToCollectionIfMissing([], service, service2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(service);
          expect(expectedResult).toContain(service2);
        });

        it('should accept null and undefined values', () => {
          const service: IService = { id: 123 };
          expectedResult = service.addServiceToCollectionIfMissing([], null, service, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(service);
        });

        it('should return initial array if no Service is added', () => {
          const serviceCollection: IService[] = [{ id: 123 }];
          expectedResult = service.addServiceToCollectionIfMissing(serviceCollection, undefined, null);
          expect(expectedResult).toEqual(serviceCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
