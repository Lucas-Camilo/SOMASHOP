/* Initialization of datatable */
var table = "";
var tentativas = 0;
produtos = [
	{ nome: 'Banana A Unidade', valor: 2.50, imagem: 'https://cdn-icons-png.flaticon.com/512/6482/6482627.png' },
	{ nome: 'Maçã Argentina A Unidade', valor: 3.50, imagem: 'https://cdn-icons-png.flaticon.com/512/812/812900.png' },
	{ nome: 'Ovo A Unidade', valor: 2.35, imagem: 'https://cdn-icons-png.flaticon.com/512/811/811434.png' },
	{ nome: 'Leite integral 1L', valor: 4.50, imagem: 'https://cdn-icons-png.flaticon.com/512/869/869664.png' },
	{ nome: 'Suco de Uva Natural 1L', valor: 4.95, imagem: 'https://images.emojiterra.com/google/android-11/512px/1f9c3.png' },
	{ nome: 'Sucrilhos 150g', valor: 8.70, imagem: 'https://cdn-icons-png.flaticon.com/512/6785/6785921.png' },
	{ nome: 'Macarrão instantâneo 350g', valor: 3.40, imagem: 'https://cdn-icons-png.flaticon.com/512/8119/8119008.png' },
	{ nome: 'Cookies de chocolates 200g', valor: 7.35, imagem: 'https://cdn-icons-png.flaticon.com/512/9622/9622163.png' },
	{ nome: 'Milho verde em conserva 285g', valor: 6.30, imagem: 'https://static.vecteezy.com/ti/vetor-gratis/p3/14187773-icone-de-lata-de-milho-estilo-cartoon-vetor.jpg' },
	{ nome: 'Achocolatado Tobby 800g', valor: 9.45, imagem: 'https://cdn-icons-png.flaticon.com/512/332/332961.png' },
	{ nome: 'Maça Verde A unidade', valor: 3.55, imagem: 'https://images.vexels.com/media/users/3/185223/isolated/preview/841c68d2314d6dc10c6b33480bbca0b3-maca-verde-fruta-plana.png' },
];

$(document).ready(function() {
	table = $('#tableID').DataTable({
		searching: false, paging: false, info: false,
		columnDefs: [
			{ className: 'dt-center', targets: '_all' }
		],
	});
	//Ordenar produtos por ordem alfabética
	//produtos.sort((produto1, produto2) => produto1.nome.toUpperCase() > produto2.nome.toUpperCase() ? 1 : -1);
	preencherCarrossel(produtos);
});

function preencherCarrossel(produtos) {
	var carrosselInner = document.querySelector('.carousel-inner');
	carrosselInner.innerHTML = ''; // Limpa o conteúdo atual do carrossel

	// Divide a lista de produtos em grupos de 4 para cada slide do carrossel
	for (var i = 0; i < produtos.length; i += 8) {
		var divItem = document.createElement('div');
		divItem.className = "carousel-item";
		if (i === 0) {
			divItem.classList.add('active'); // Define o primeiro item como ativo
		}

		var divRow = document.createElement('div');
		divRow.className = "row";

		// Adiciona os cards de produtos ao slide atual do carrossel
		for (var j = i; j < Math.min(i + 8, produtos.length); j++) {
			var produto = produtos[j];

			var divCol = document.createElement('div');
			divCol.className = "col-md-3 mb-1";

			var divCard = document.createElement('div');
			divCard.className = "card produto";
			divCard.id = produto.nome;

			var divCardBody = document.createElement('div');
			divCardBody.className = "card-body text-center cartao d-flex flex-column justify-content-between";

			var titulo = document.createElement('p');
			titulo.className = "card-title NomeProduto";
			titulo.textContent = produto.nome.toUpperCase();

			var img = document.createElement('img');
			img.src = produto.imagem;
			img.className = "card-img-top mx-auto mt-auto";

			var textoPreco = document.createElement('p');
			textoPreco.className = "card-text mt-auto";
			textoPreco.textContent = "R$ " + produto.valor.toFixed(2);

			var divBotao = document.createElement('div');
			divBotao.className = "mt-auto";

			var botao = document.createElement('button');
			botao.type = "button";
			botao.className = "btn btn-primary mt-auto";
			botao.textContent = "Adicionar";

			botao.onclick = (function(produtoNome) {
				return function() {
					addItem(produtoNome);
				};
			})(produto.nome);

			divBotao.appendChild(botao);

			divCardBody.appendChild(titulo);
			divCardBody.appendChild(img);
			divCardBody.appendChild(textoPreco);
			divCardBody.appendChild(divBotao);

			divCard.appendChild(divCardBody);

			divCol.appendChild(divCard);

			divRow.appendChild(divCol);
		}

		divItem.appendChild(divRow);
		carrosselInner.appendChild(divItem);
	}
}

function calculaTotal() {
	var total = 0;
	var tableData = table.rows().data();
	for (let i = 0; i < tableData.length; i++) {
		var quantidade = parseFloat(tableData[i][3]);
		var valorUnitario = parseFloat(tableData[i][2].replace('R$', '').trim());
		total += quantidade * valorUnitario;
	}
	$('#totalInput').prop('value', total.toFixed(2));
}

function addItem(nomeProduto) {
	var ultimaLinha = table.rows().data().length;
	ultimaLinha++;
	for (let i = 0; i < table.rows().data().length; i++) {
		if (table.rows().data()[i][1] == nomeProduto) {
			quantidade = parseInt(table.rows().data()[i][3]) + 1;
			table.cell(i, 3).data(quantidade).draw();
			calculaTotal();
			return;
		}
	}

	for (let i = 0; i < produtos.length; i++) {
		if (produtos[i].nome == nomeProduto) {
			table.row.add([ultimaLinha, produtos[i].nome, "R$ " + produtos[i].valor.toFixed(2), 1]).draw();
			calculaTotal();
			return;
		}
	}
}

function Finalizar() {
	var total = parseFloat(document.getElementById('totalInput').value);
	var valorInformado = parseFloat(document.getElementById('valorInformado').value);
	var trocoInformado = parseFloat(document.getElementById('trocoInformado').value)
	if (!isNaN(total)) {
		var troco = (valorInformado - total).toFixed(2);
		//Verifica se acertou o troco
		if (troco == trocoInformado) {
			$('#totalInput').addClass('input-verde');
			$('#myModal').modal('hide');
			playAudio();
		}
		else {
			if (tentativas < 3) {
				$('#TextoResposta').html("Troco Incorreto");
				$('#RespostaFinal').modal('show');
				tentativas++;
			}
			else {
				$('#TextoResposta').html("Tentativas Excedidas");
				$('#totalInput').addClass('input-vermelho');
				$('#RespostaFinal').modal('show');
			}
		}
	} else {
		alert("Erro ao calcular o total da compra.");
	}
}

function Cancelamento() {
	var linha = document.getElementById("linhaQuerCancelar").value;
	//linha = 2;
	encontrado = false;
	//Verifica se a linha existe na tabela
	if (linha > 0 && linha <= table.rows().data().length) {
		for (let i = 0; i < table.rows().data().length; i++) {
			if (table.rows().data()[i][0] == linha) {
				table.row(i).remove().draw();
				encontrado = true;
				break;
			}
		}
		if (encontrado) {
			for (let i = 0; i < table.rows().data().length; i++) {
				table.cell(i, 0).data(i + 1).draw();
			}
		}
	}
	calculaTotal();
	$('#CancelamentoModal').modal('hide');
	//Limpar o campo
	$("#linhaQuerCancelar").val("");
}

function playAudio() {
	var audio = document.getElementById("meuAudio");
	audio.currentTime = 2;
	audio.play();
}