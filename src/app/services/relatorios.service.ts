import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

  gerarRelatorioPessoas(pessoas: any[]): void {
    if (!pessoas || pessoas.length === 0) {
      alert('Não há dados para gerar o relatório.');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Relatório de Pessoas Cadastradas', 14, 20);

    const colunas = ['Nome', 'Telefone', 'E-mail', 'Membro', 'Data Nasc.'];
    const linhas = pessoas.map(p => [
      p.nome,
      p.fone,
      p.email || '-',
      p.membro ? 'Sim' : 'Não',
      p.dataNascimento || '-'
    ]);

    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 30,
      styles: { fontSize: 10 },
    });

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${dataAtual}`, 14, doc.internal.pageSize.height - 10);

    doc.output('dataurlnewwindow');
  }
}
