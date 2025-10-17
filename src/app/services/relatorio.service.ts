import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  async gerarRelatorioPessoas(pessoas: any[]): Promise<void> {
    if (!pessoas || pessoas.length === 0) {
      alert('Não há dados para gerar o relatório.');
      return;
    }

    // 🧠 Função auxiliar para formatar datas no padrão dd/MM/yyyy
    const formatarData = (data: string | Date | null | undefined): string => {
      if (!data) return '-';
      const d = new Date(data);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    // 🧾 Criação do PDF no formato paisagem (landscape)
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // 🎨 Cor de fundo da página (#F4F4F9)
    doc.setFillColor(244, 244, 249);
    doc.rect(0, 0, pageWidth, pageHeight, 'F'); // preenche toda a página

    // 🖼️ Adiciona imagem de cabeçalho centralizada e ampliada
    let posicaoYDepoisDaImagem = 0;

    try {
      const img = await this.carregarImagemBase64('assets/img/header3.png');

      const imgWidth = 100;  // 🔸 pode ajustar (ex: 90, 100)
      const imgHeight = 40; // 🔸 altura proporcional
      const imgX = (pageWidth - imgWidth) / 2; // 🔹 centraliza horizontalmente
      const imgY = -8; // 🔹 distância do topo

      doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

      // 🧩 calcula a posição Y logo abaixo da imagem com espaçamento extra
      posicaoYDepoisDaImagem = imgY + imgHeight + 10;
    } catch (e) {
      console.warn('⚠️ Não foi possível carregar a imagem header3.png:', e);
      posicaoYDepoisDaImagem = 35; // valor padrão se a imagem não carregar
    }

    // 🏷️ Cabeçalho do relatório (centralizado e com espaçamento após imagem)
    doc.setFontSize(16);
    doc.text('Relatório de Pessoas Cadastradas', pageWidth / 2, posicaoYDepoisDaImagem, { align: 'center' });

    // 🔧 Ajusta o início da tabela (dá espaço extra entre o título e a tabela)
    const inicioTabelaY = posicaoYDepoisDaImagem + 10;

    // 🧩 Colunas da tabela
    const colunas = [
      'Início Membresia',
      'Nome',
      'Telefone',
      'E-mail',
      'Membro',
      'Data Nasc.',
      'Endereço'
    ];

    // 🧮 Linhas da tabela
    const linhas = pessoas.map(p => [
      formatarData(p.dataInicioMembresia),
      p.nome,
      p.fone,
      p.email || '-',
      p.membro ? 'Sim' : 'Não',
      formatarData(p.dataNascimento),
      (p.logradouro && p.localidade)
        ? `${p.logradouro} - ${p.localidade}`
        : p.logradouro || p.localidade || '-'
    ]);

    // 📋 Criação da tabela
    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: inicioTabelaY, // ⬅️ agora usa a posição dinâmica
      styles: { fontSize: 10, cellWidth: 'wrap', valign: 'middle' },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' },
        1: { cellWidth: 45 },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 50 },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 30, halign: 'center' },
        6: { cellWidth: 75 }
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // 🕓 Rodapé
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${dataAtual}`, 14, pageHeight - 10);

    // 🔍 Abre o PDF em nova aba
    doc.output('dataurlnewwindow');
  }

  // 🔧 Função para carregar imagem em Base64 a partir do caminho
  private carregarImagemBase64(caminho: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = caminho;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Erro ao criar contexto de canvas');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = err => reject(err);
    });
  }
}
