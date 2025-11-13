
// Variáveis 
let conta = null;
let movimentacoes = [];

/* -Relógio em tempo real */
function atualizarRelogio() {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour12: false });
  document.getElementById("relogio").textContent = `${data} ${hora}`;
}
setInterval(atualizarRelogio, 1000);
window.onload = atualizarRelogio;

/* Função auxiliar para data/hora formatada*/
function obterDataHoraAtual() {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour12: false });
  return `[${data} ${hora}]`;
}

/* Abrir conta bancária */
function abrirConta() {
  const nome = document.getElementById("nome").value.trim();
  const tipo = document.getElementById("tipoConta").value;
  
  if (nome === "") {
    alert("Por favor, informe o nome do cliente!");
    return;
  }

  conta = {
    nomeCliente: nome,
    tipoConta: tipo,
    saldo: 0,
    ativa: true
  };

  movimentacoes = [];
  movimentacoes.push(`${obterDataHoraAtual()} Abertura de conta ${tipo} feita por ${nome}`);

  if (tipo === "poupanca") {
    movimentacoes.push(`${obterDataHoraAtual()}  CONTA POUPANÇA: Direito a juros de 0,5% ao mês!`);
  }

  document.getElementById("resConta").innerHTML =
    `✅ Conta <strong>${tipo}</strong> criada com sucesso para <strong>${nome}</strong>.`;

  document.getElementById("nome").disabled = true;
  document.getElementById("tipoConta").disabled = true;
  document.getElementById("btnAbrir").disabled = true;
  habilitarOperacoes(true);
}

/* Habilitar ou desabilitar botões de operação*/
function habilitarOperacoes(estado) {
  document.getElementById("btnDepositar").disabled = !estado;
  document.getElementById("btnSacar").disabled = !estado;
  document.getElementById("btnSaldo").disabled = !estado;
  document.getElementById("btnMov").disabled = !estado;
  document.getElementById("btnEncerrar").disabled = !estado;
}

/* Depósito*/
function depositar() {
  if (!contaAtiva()) return;

  const valor = parseFloat(prompt("Digite o valor do depósito:"));
  if (isNaN(valor) || valor <= 0) {
    alert("Valor inválido!");
    return;
  }

  conta.saldo += valor;
  movimentacoes.push(`${obterDataHoraAtual()} ${conta.nomeCliente} depositou R$ ${valor.toFixed(2)}`);

  document.getElementById("resOperacoes").innerHTML =
    `💰 Depósito realizado! Saldo atual: <strong>R$ ${conta.saldo.toFixed(2)}</strong>`;
}

/* Saque */
function sacar() {
  if (!contaAtiva()) return;

  const valor = parseFloat(prompt("Digite o valor do saque:"));
  if (isNaN(valor) || valor <= 0) {
    alert("Valor inválido!");
    return;
  }

  if (valor > conta.saldo) {
    alert("Saldo insuficiente!");
    return;
  }

  conta.saldo -= valor;
  movimentacoes.push(`${obterDataHoraAtual()} ${conta.nomeCliente} sacou R$ ${valor.toFixed(2)}`);

  document.getElementById("resOperacoes").innerHTML =
    `💸 Saque realizado! Saldo atual: <strong>R$ ${conta.saldo.toFixed(2)}</strong>`;
}

/* Ver saldo */
function verSaldo() {
  if (!contaAtiva()) return;
  document.getElementById("resOperacoes").innerHTML =
    ` Saldo atual: <strong>R$ ${conta.saldo.toFixed(2)}</strong>`;
}

/* -Listar movimentações */
function listarMovimentos() {
  if (!contaAtiva()) return;

  if (movimentacoes.length === 0) {
    document.getElementById("resOperacoes").innerHTML =
      "Nenhuma movimentação registrada.";
    return;
  }

  const lista = movimentacoes.join("<br>");
  document.getElementById("resOperacoes").innerHTML =
    `<strong>📜 Movimentações:</strong><br>${lista}`;
}

/* Encerrar conta*/
function encerrarConta() {
  if (!contaAtiva()) return;

  const confirma = confirm("Tem certeza que deseja encerrar a conta?");
  if (confirma) {
    movimentacoes.push(`${obterDataHoraAtual()} Conta de ${conta.nomeCliente} foi encerrada`);
    conta.ativa = false;

    document.getElementById("resOperacoes").innerHTML =
      `⚠️ Conta de <strong>${conta.nomeCliente}</strong> encerrada com sucesso!`;

    document.getElementById("nome").value = "";
    document.getElementById("tipoConta").value = "corrente";
    document.getElementById("nome").disabled = false;
    document.getElementById("tipoConta").disabled = false;
    document.getElementById("btnAbrir").disabled = false;
    habilitarOperacoes(false);

    conta = null;
    movimentacoes = [];
    document.getElementById("resConta").innerHTML = "";
  }
}

/* Verifica se há conta ativa */
function contaAtiva() {
  if (!conta || !conta.ativa) {
    alert("Nenhuma conta ativa! Abra uma nova conta primeiro.");
    return false;
  }
  return true;
}