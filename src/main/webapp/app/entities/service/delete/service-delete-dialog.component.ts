import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IService } from '../service.model';
import { ServiceService } from '../service/service.service';

@Component({
  templateUrl: './service-delete-dialog.component.html',
})
export class ServiceDeleteDialogComponent {
  service?: IService;

  constructor(protected serviceService: ServiceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.serviceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
