let conta = null;
let movimentacoes = [];
let dataUltimoDeposito = null;
let valorPendenteDeposito = 0;

/* Relógio  */
function atualizarRelogio() {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour12: false });
  document.getElementById("relogio").textContent = `${data} ${hora}`;
}
setInterval(atualizarRelogio, 1000);
window.onload = atualizarRelogio;

/*  Data formatada  */
function obterDataHoraAtual() {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR');
  const hora = agora.toLocaleTimeString('pt-BR', { hour12: false });
  return `[${data} ${hora}]`;
}

/*  Abrir conta  */
function abrirConta() {
  const nome = document.getElementById("nome").value.trim();
  const tipo = document.getElementById("tipoConta").value;

  if (nome === "") {
    alert("Por favor, informe o nome do cliente!");
    return;
  }

  conta = { nomeCliente: nome, tipoConta: tipo, saldo: 0, ativa: true };
  movimentacoes = [];
  movimentacoes.push(`${obterDataHoraAtual()} Conta ${tipo} aberta para ${nome}`);
  if (tipo === "poupanca") {
    movimentacoes.push(`${obterDataHoraAtual()} Conta Poupança: direito a juros de 0,5% ao mês.`);
  }

  document.getElementById("resConta").innerHTML = `✅ Conta <strong>${tipo}</strong> criada com sucesso para <strong>${nome}</strong>.`;
  document.getElementById("nome").disabled = true;
  document.getElementById("tipoConta").disabled = true;
  document.getElementById("btnAbrir").disabled = true;
  habilitarOperacoes(true);
}

/*  Habilita botões  */
function habilitarOperacoes(estado) {
  document.getElementById("btnDepositar").disabled = !estado;
  document.getElementById("btnSacar").disabled = !estado;
  document.getElementById("btnSaldo").disabled = !estado;
  document.getElementById("btnMov").disabled = !estado;
  document.getElementById("btnEncerrar").disabled = !estado;
}

/* Etapa 1: Mostrar aviso antes do depósito */
function mostrarAvisoDeposito() {
  if (!contaAtiva()) return;

  const valor = parseFloat(prompt("Digite o valor do depósito:"));
  if (isNaN(valor) || valor <= 0) {
    alert("Valor inválido!");
    return;
  }

  valorPendenteDeposito = valor;
  const juros = valor * 0.005;
  const aviso = document.getElementById("avisoDeposito");
  document.getElementById("textoAviso").innerHTML =
    `💰 Você está prestes a depositar <strong>R$ ${valor.toFixed(2)}</strong>.<br>
     Se não houver saque por 30 dias, você receberá <strong>R$ ${juros.toFixed(2)}</strong> de juros (0,5%).<br><br>
     Deseja confirmar o depósito?`;

  aviso.style.display = "flex";
}

/* Etapa 2: Confirmar ou cancelar depósito */
function confirmarDeposito(confirmado) {
  const aviso = document.getElementById("avisoDeposito");
  aviso.style.display = "none";

  if (!confirmado) {
    document.getElementById("resOperacoes").innerHTML =
      `<p style="color:red; font-weight:bold;">❌ Depósito cancelado pelo usuário.</p>`;
    movimentacoes.push(`${obterDataHoraAtual()} Depósito cancelado.`);
    return;
  }

  conta.saldo += valorPendenteDeposito;
  dataUltimoDeposito = new Date();
  movimentacoes.push(`${obterDataHoraAtual()} ${conta.nomeCliente} depositou R$ ${valorPendenteDeposito.toFixed(2)}.`);
  
  document.getElementById("resOperacoes").innerHTML =
    `<p style="color:green; font-weight:bold;">
      ✅ Depósito confirmado! Saldo atual: R$ ${conta.saldo.toFixed(2)}
    </p>`;

  valorPendenteDeposito = 0;
}

/* Saque com juros */
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

  if (conta.tipoConta === "poupanca" && dataUltimoDeposito) {
    const agora = new Date();
    const diffDias = Math.floor((agora - dataUltimoDeposito) / (1000 * 60 * 60 * 24));

    if (diffDias >= 30) {
      const juros = conta.saldo * 0.005;
      conta.saldo += juros;
      movimentacoes.push(`${obterDataHoraAtual()} Juros de 0,5% aplicados após ${diffDias} dias (+R$ ${juros.toFixed(2)}).`);
      document.getElementById("resOperacoes").innerHTML =
        `<p style="color:green; font-weight:bold;">
          🎉 Parabéns! Juros de R$ ${juros.toFixed(2)} aplicados. Novo saldo: R$ ${conta.saldo.toFixed(2)}
        </p>`;
    } else {
      const confirmar = confirm(`Ainda não se passaram 30 dias (${diffDias} dias).\nDeseja sacar mesmo assim e perder os juros?`);
      if (!confirmar) {
        document.getElementById("resOperacoes").innerHTML =
          `<p style="color:red; font-weight:bold;">❌ Saque cancelado: o cliente preferiu aguardar os juros.</p>`;
        movimentacoes.push(`${obterDataHoraAtual()} Saque cancelado pelo cliente (aguardando juros).`);
        return;
      }
      movimentacoes.push(`${obterDataHoraAtual()} Cliente realizou saque antes de 30 dias (sem juros).`);
    }
  }

  conta.saldo -= valor;
  movimentacoes.push(`${obterDataHoraAtual()} ${conta.nomeCliente} sacou R$ ${valor.toFixed(2)}.`);
  document.getElementById("resOperacoes").innerHTML +=
    `<p>💸 Saque realizado! Saldo atual: <strong>R$ ${conta.saldo.toFixed(2)}</strong></p>`;
}

/* Ver saldo */
function verSaldo() {
  if (!contaAtiva()) return;
  document.getElementById("resOperacoes").innerHTML =
    `📊 Saldo atual: <strong>R$ ${conta.saldo.toFixed(2)}</strong>`;
}

/* Movimentações */
function listarMovimentos() {
  if (!contaAtiva()) return;
  if (movimentacoes.length === 0) {
    document.getElementById("resOperacoes").innerHTML = "Nenhuma movimentação registrada.";
    return;
  }
  const lista = movimentacoes.join("<br>");
  document.getElementById("resOperacoes").innerHTML = `<strong>📜 Movimentações:</strong><br>${lista}`;
}

/* Encerrar conta */
function encerrarConta() {
  if (!contaAtiva()) return;
  const confirma = confirm("Tem certeza que deseja encerrar a conta?");
  if (confirma) {
    movimentacoes.push(`${obterDataHoraAtual()} Conta encerrada.`);
    conta.ativa = false;
    document.getElementById("resOperacoes").innerHTML = `⚠️ Conta encerrada com sucesso!`;
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

/* Verifica conta */
function contaAtiva() {
  if (!conta || !conta.ativa) {
    alert("Nenhuma conta ativa! Abra uma nova conta primeiro.");
    return false;
  }
  return true;
}
