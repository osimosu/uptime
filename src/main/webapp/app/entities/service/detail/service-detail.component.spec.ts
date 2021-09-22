import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ServiceDetailComponent } from './service-detail.component';

describe('Component Tests', () => {
  describe('Service Management Detail Component', () => {
    let comp: ServiceDetailComponent;
    let fixture: ComponentFixture<ServiceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ServiceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ service: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ServiceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ServiceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load service on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.service).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
