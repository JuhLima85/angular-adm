import { Component, EventEmitter, Output } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-relatorio-modal',
  templateUrl: './relatorio-modal.component.html',
  styleUrls: ['./relatorio-modal.component.css']
})
export class RelatorioModalComponent {
  tipoRelatorio: string = 'todos';

  @Output() gerar = new EventEmitter<string>();
  private modalInstance: any

  abrir() {
    const modalElement = document.getElementById('modalRelatorio');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  confirmar() {
    this.gerar.emit(this.tipoRelatorio);
    this.fechar();
  }

  fechar() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null; 
    }
  }
}
