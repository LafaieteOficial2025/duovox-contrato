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

  if (str.includes('(')) return str;

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
    mesNum = parseInt(partes[1], 
