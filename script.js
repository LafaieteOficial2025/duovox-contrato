document.getElementById('contractForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });

  // Puxar valores
  const nome = document.getElementById('nomeCliente').value.trim();
  const cpf = document.getElementById('cpfCliente').value.trim();
  const endCliente = document.getElementById('endCliente').value.trim();
  const dataRaw = document.getElementById('dataEvento').value;
  const horario = document.getElementById('horarioEvento').value.trim();
  const tipoEvento = document.getElementById('tipoEvento').value.trim();
  const localEvento = document.getElementById('localEvento').value.trim();
  const valorTotal = parseFloat(document.getElementById('valorTotal').value);

  // Tratamento de dados
  const dataObj = new Date(dataRaw + 'T00:00:00');
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');
  const primeiroNome = nome.split(' ')[0].toUpperCase();
  const diaMesAno = dataFormatada.replaceAll('/', '').slice(0, 4) + dataFormatada.slice(-2);
  const codContrato = `DV-${primeiroNome}-${diaMesAno}`;

  const entrada = (valorTotal / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const saldo = (valorTotal / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const valorTotalStr = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Configuração PDF
  doc.setFont("helvetica");
  let y = 15;

  // Cabeçalho
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("DUOVOX - MÚSICA PERFORMANCE EXPERIÊNCIA", 105, y, { align: "center" });
  y += 7;
  doc.setFontSize(11);
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS MUSICAIS E ARTÍSTICOS", 105, y, { align: "center" });
  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`CÓDIGO: ${codContrato} | DATA DO EVENTO: ${dataFormatada} | HORÁRIO: ${horario}`, 105, y, { align: "center" });
  y += 8;
  doc.line(15, y, 195, y);
  y += 7;

  // Cláusulas Resumidas/Completas
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("1. IDENTIFICAÇÃO DAS PARTES", 15, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const textoPartes = `CONTRATADA: DUOVOX, representada por Arnaldo Lafaiete Roque Lopes, RG nº 24.267.067-2 SSP/SP, CPF nº 067.234.088-70.\nCONTRATANTE: ${nome}, CPF nº ${cpf}, residente à ${endCliente}.`;
  doc.text(textoPartes, 15, y);
  y += 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("2. OBJETO, LOCAL E DURAÇÃO", 15, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const textoObjeto = `A CONTRATADA realizará apresentação musical do projeto DUOVOX, com sonorização e iluminação, no dia ${dataFormatada}, das ${horario}, para evento do tipo: ${tipoEvento}, no local: ${localEvento}.`;
  const splitObjeto = doc.splitTextToSize(textoObjeto, 180);
  doc.text(splitObjeto, 15, y);
  y += (splitObjeto.length * 4) + 4;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("3. VALOR E PAGAMENTO", 15, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const textoPgto = `VALOR TOTAL: ${valorTotalStr} | ENTRADA (50%): ${entrada} na assinatura | SALDO (50%): ${saldo} até 2h antes do início do evento.\nPIX: Titular Arnaldo Lafaiete Roque Lopes | Banco Nubank | Chave PIX: 17992248457.`;
  doc.text(textoPgto, 15, y);
  y += 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("4. ESTRUTURA TÉCNICA E REQUISITOS", 15, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const textoTecnica = `Inclui sistema de som compatível, iluminação (canhões LED RGBWA, mini moving heads, centopeia RGB, máquina de fumaça) e montagem/operação. O CONTRATANTE disponibilizará energia estável, acesso em tempo hábil, mesa de apoio para até 4 profissionais e alimentação/bebidas não alcoólicas.`;
  const splitTecnica = doc.splitTextToSize(textoTecnica, 180);
  doc.text(splitTecnica, 15, y);
  y += (splitTecnica.length * 4) + 8;

  // Assinaturas
  y += 15;
  doc.line(20, y, 90, y);
  doc.line(110, y, 180, y);
  y += 4;
  doc.text(`CONTRATANTE: ${nome}`, 20, y);
  doc.text("CONTRATADA: DUOVOX (Arnaldo Lafaiete)", 110, y);

  // Baixar
  doc.save(`Contrato_${codContrato}.pdf`);
});