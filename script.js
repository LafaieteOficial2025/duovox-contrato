// Máscara automática para data (DD/MM/AAAA)
const dataInput = document.getElementById('dataEvento');
dataInput.addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 8);
  if (v.length >= 5) {
    e.target.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`;
  } else if (v.length >= 3) {
    e.target.value = `${v.slice(0, 2)}/${v.slice(2)}`;
  } else {
    e.target.value = v;
  }
});

// Máscara automática para CPF (000.000.000-00)
const cpfInput = document.getElementById('cpfCliente');
cpfInput.addEventListener('input', function(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length >= 10) {
    e.target.value = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9, 11)}`;
  } else if (v.length >= 7) {
    e.target.value = `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
  } else if (v.length >= 4) {
    e.target.value = `${v.slice(0, 3)}.${v.slice(3)}`;
  } else {
    e.target.value = v;
  }
});

// Função para formatar o Horário (ex: "20" -> "20h" / "20:30" -> "20h30")
function formatarHorario(str) {
  str = str.trim();
  if (!str) return '';
  if (/^\d+$/.test(str)) {
    return `${str}h`;
  }
  if (str.includes(':')) {
    const p = str.split(':');
    return p[1] === '00' ? `${p[0]}h` : `${p[0]}h${p[1]}`;
  }
  return str.endsWith('h') || str.endsWith('H') ? str.toLowerCase() : `${str}h`;
}

// Função para formatar o Tempo de Show por extenso (ex: "3" -> "3h (três horas)")
function formatarTempoShow(str) {
  str = str.trim();
  if (!str) return '';

  const numerosExtenso = {
    '1': 'uma hora',
    '2': 'duas horas',
    '3': 'três horas',
    '4': 'quatro horas',
    '5': 'cinco horas',
    '6': 'seis horas',
    '7': 'sete horas',
    '8': 'oito horas',
    '9': 'nove horas',
    '10': 'dez horas'
  };

  // Se já tiver parênteses com extenso, retorna como está
  if (str.includes('(')) return str;

  // Extrai o número digitado
  const numMatch = str.match(/\d+/);
  if (numMatch) {
    const num = numMatch[0];
    const extenso = numerosExtenso[num] || `${num} horas`;
    return `${num}h (${extenso})`;
  }

  return str;
}

document.getElementById('contractForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });

  // Puxar valores do formulário
  const nome = document.getElementById('nomeCliente').value.trim();
  const cpf = document.getElementById('cpfCliente').value.trim();
  const endCliente = document.getElementById('endCliente').value.trim();
  const dataRaw = document.getElementById('dataEvento').value.trim();
  const horarioRaw = document.getElementById('horarioEvento').value.trim();
  const tempoShowRaw = document.getElementById('tempoShow').value.trim();
  const tipoEvento = document.getElementById('tipoEvento').value.trim();
  const localEvento = document.getElementById('localEvento').value.trim();
  const valorTotal = parseFloat(document.getElementById('valorTotal').value);

  // Formatações automáticas de Horário e Tempo
  const horario = formatarHorario(horarioRaw);
  const tempoShow = formatarTempoShow(tempoShowRaw);

  // --- TRATAMENTO DA DATA NO FORMATO DIA/MÊS/ANO ---
  let diaNum, mesNum, ano;
  if (dataRaw.includes('/')) {
    const partes = dataRaw.split('/');
    diaNum = parseInt(partes[0], 10);
    mesNum = parseInt(partes[1], 10);
    ano = partes[2];
  } else if (dataRaw.includes('-')) {
    const partes = dataRaw.split('-');
    ano = partes[0];
    mesNum = parseInt(partes[1], 10);
    diaNum = parseInt(partes[2], 10);
  }

  const mesesNomes = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  const mesNome = mesesNomes[mesNum - 1];

  const dataObjFixo = new Date(ano, mesNum - 1, diaNum);
  const diasSemana = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA',
    'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'];
  const diaSemanaNome = diasSemana[dataObjFixo.getDay()];

  const diaStr = String(diaNum).padStart(2, '0');
  const mesStr = String(mesNum).padStart(2, '0');

  const dataFormatada = `${diaStr}/${mesStr}/${ano}`;
  const dataExtenso = `${diaSemanaNome}, ${diaNum} DE ${mesNome} DE ${ano}`;

  const primeiroNome = nome.split(' ')[0].toUpperCase();
  const codContrato = `DV-${primeiroNome}-${diaStr}${mesStr}${ano.slice(-2)}`;

  // Formatação dos valores
  const entrada = (valorTotal / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const saldo = (valorTotal / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const valorTotalStr = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  let y = 15;
  const margem = 15;
  const larguraMax = 180;

  function verificarQuebra(alturaNecessaria) {
    if (y + alturaNecessaria > 275) {
      doc.addPage();
      y = 15;
    }
  }

  // --- CABEÇALHO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("DUOVOX", margem, y);
  y += 5;
  doc.setFontSize(9);
  doc.text("MÚSICA PERFORMANCE EXPERIÊNCIA", margem, y);
  y += 6;
  doc.setFontSize(12);
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS MUSICAIS E ARTÍSTICOS", margem, y);
  y += 5;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Apresentação musical com fornecimento de sonorização e iluminação", margem, y);
  y += 7;

  // Caixa de Resumo Superior
  doc.setDrawColor(150);
  doc.rect(margem, y, larguraMax, 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CONTRATO", margem + 5, y + 5);
  doc.text("DATA DO EVENTO", margem + 65, y + 5);
  doc.text("HORÁRIO", margem + 130, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(codContrato, margem + 5, y + 10);
  doc.text(dataFormatada, margem + 65, y + 10);
  doc.text(horario, margem + 130, y + 10);
  y += 20;

  // --- FUNÇÃO DE SEÇÃO ---
  function addSecao(titulo, texto) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const linhasTitulo = doc.splitTextToSize(titulo, larguraMax);
    verificarQuebra((linhasTitulo.length * 5) + 5);
    doc.text(linhasTitulo, margem, y);
    y += (linhasTitulo.length * 5) + 3;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const paragrafos = texto.split('\n');
    let todasLinhas = [];
    paragrafos.forEach(function (paragrafo) {
      const linhas = doc.splitTextToSize(paragrafo, larguraMax);
      todasLinhas = todasLinhas.concat(linhas);
    });

    verificarQuebra(todasLinhas.length * 6);
    doc.text(todasLinhas, margem, y);
    y += (todasLinhas.length * 6) + 6;
  }

  // --- CLÁUSULAS ---
  addSecao("1. IDENTIFICAÇÃO DAS PARTES",
    `CONTRATADA: DUOVOX, nome artístico do projeto musical, neste ato representada por Arnaldo Lafaiete Roque Lopes, RG nº 24.267.067-2 SSP/SP, CPF nº 067.234.088-70, doravante denominada CONTRATADA.\nCONTRATANTE: ${nome}, CPF nº ${cpf}, residente à ${endCliente}, doravante denominada CONTRATANTE.`);

  addSecao("2. OBJETO, LOCAL E DURAÇÃO",
    `A CONTRATADA realizará apresentação musical com o projeto DUOVOX, incluindo sonorização e iluminação, para evento do tipo "${tipoEvento}", nas condições abaixo:\n• DATA: ${dataExtenso}\n• HORÁRIO PREVISTO DO EVENTO: ${horario}\n• TEMPO DE SHOW AO VIVO: ${tempoShow}\n• LOCAL: ${localEvento}\nA apresentação ao vivo terá a duração prevista acima, podendo iniciar em momento posterior ao horário de abertura do evento, conforme combinado entre as partes. Qualquer prorrogação dependerá de disponibilidade e concordância prévia das partes, com valor adicional por hora ou fração expressamente combinado por escrito antes da extensão.`);

  addSecao("3. VALOR E PAGAMENTO",
    `VALOR TOTAL: ${valorTotalStr} | ENTRADA (50%): ${entrada} | SALDO (50%): ${saldo}\nA entrada de ${entrada} é devida na assinatura, para reserva da data. O saldo de ${saldo} deverá ser quitado até 18h do dia do evento, ou seja, até 2 (duas) horas antes do início previsto. A CONTRATADA poderá suspender a montagem ou a apresentação enquanto houver valor vencido e não pago.\nPIX: Titular Arnaldo Lafaiete Roque Lopes | Banco Nubank | Chave PIX: 17992248457. O pagamento será considerado realizado após a efetiva confirmação do crédito.`);

  addSecao("4. ESTRUTURA TÉCNICA INCLUÍDA",
    `O valor inclui sistema de som compatível com o evento e iluminação composta por canhões LED RGBWA, mini moving head spot, mini moving beam, centopeia RGB e máquina de fumaça, além de montagem, operação e desmontagem. A CONTRATANTE deverá assegurar acesso ao local em tempo hábil, área apropriada para montagem, fornecimento elétrico estável e seguro, mesa de apoio para até quatro profissionais e alimentação/bebidas não alcoólicas em quantidade razoável.`);

  addSecao("5. REPERTÓRIO E CONDIÇÕES DA APRESENTAÇÃO",
    `A seleção e a ordem do repertório serão definidas pela CONTRATADA, considerando a proposta artística do DUOVOX. Pedidos específicos poderão ser avaliados previamente, sem garantia de inclusão. A CONTRATANTE deverá informar com antecedência eventuais restrições de horário, volume, uso de fumaça ou outras regras do espaço.`);

  addSecao("6. OBRIGAÇÕES DA CONTRATADA",
    `Compete à CONTRATADA: (a) realizar a apresentação no local, data e período contratados; (b) fornecer e operar os equipamentos sob sua responsabilidade; (c) comunicar fatos relevantes que possam comprometer a execução; e (d) adotar cuidados razoáveis de segurança.`);

  addSecao("7. OBRIGAÇÕES DA CONTRATANTE",
    `Compete à CONTRATANTE: (a) pagar o preço nos prazos pactuados; (b) disponibilizar o local e o acesso necessários; (c) garantir instalação elétrica e condições estruturais adequadas; (d) obter alvarás e licenças exigíveis; (e) cumprir regras de segurança, lotação e ruído; e (f) manter ambiente seguro para artistas, equipe e equipamentos.`);

  addSecao("8. ALIMENTAÇÃO, APOIO E DESLOCAMENTO",
    `A CONTRATANTE disponibilizará mesa de apoio para até quatro profissionais e alimentação e bebidas não alcoólicas em quantidade razoável para a equipe durante o período do evento. O preço contratado inclui o deslocamento ordinário da equipe.`);

  addSecao("9. CANCELAMENTO, RESCISÃO E REMARCAÇÃO",
    `O pedido de cancelamento ou remarcação deverá ser comunicado por escrito. As partes deverão priorizar a remarcação consensual. Em caso de cancelamento imotivado pela CONTRATANTE, poderão ser descontadas despesas comprovadas e compensação proporcional pelo bloqueio da data, respeitada a legislação aplicável.`);

  addSecao("10. RESPONSABILIDADE, DANOS E SEGURANÇA",
    `Cada parte responde pelos danos que causar por ação ou omissão. A CONTRATANTE responde por danos aos equipamentos decorrentes de ato seu ou de convidados. A CONTRATADA poderá interromper temporariamente a operação diante de risco concreto à integridade de pessoas ou equipamentos.`);

  addSecao("11. INTRANSFERIBILIDADE E ALTERAÇÕES",
    `Este contrato não poderá ser cedido a terceiros sem concordância escrita. Alterações de data, horário, local, duração ou preço somente terão validade quando registradas por escrito e aceitas por ambas as partes.`);

  addSecao("12. INADIMPLEMENTO E DISPOSIÇÕES LEGAIS",
    `O descumprimento contratual sujeitará a parte responsável às consequências previstas neste instrumento e na legislação aplicável (Arts. 421 e 422 do Código Civil). Nenhuma disposição afasta direitos inderrogáveis de consumidor.`);

  addSecao("13. FORO E ASSINATURAS",
    `Eventuais controvérsias serão submetidas ao foro legalmente competente, observando a proteção legal da CONTRATANTE como consumidora.`);

  // --- BLOCO DE ASSINATURAS ---
  verificarQuebra(40);
  y += 10;
  doc.line(20, y, 90, y);
  doc.line(110, y, 180, y);
  y += 5;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`CONTRATANTE: ${nome}`, 20, y);
  doc.text("CONTRATADA: DUOVOX", 110, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`CPF: ${cpf}`, 20, y);
  doc.text("CPF: 067.234.088-70 (Arnaldo Lafaiete)", 110, y);

  // Download do PDF
  doc.save(`Contrato_${codContrato}.pdf`);
});
