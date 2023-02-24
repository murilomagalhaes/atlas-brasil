/**
 * Define categoria
 * @param {string} categoria 
 */
function setCategoria(categoria) {

    // Busca botão da categoria selecionada
    let btnCategoria = document.querySelector(`#btn_${categoria}`);

    // Adiciona display none para texto padrão
    document.querySelector('#categoria_nenhuma').classList.add('d-none');

    // Removeclasse active dos botões
    document.querySelectorAll('button').forEach((button) => {
        button.classList.remove('active');
    });

    // Adiciona display none para divs de categorias
    document.querySelectorAll('.categorias').forEach((categoria) => {
        categoria.classList.add('d-none');
    });

    // Remove display none da categoria selecionada
    document.querySelector(`#categoria_${categoria}`).classList.remove('d-none');

    // Adiciona classe active para botão da categoria selecionada
    switch (categoria) {
        case 'bancos': btnCategoria.classList.add('active'); break;
        case 'ceps': btnCategoria.classList.add('active'); break;
        case 'cnpj': btnCategoria.classList.add('active'); break;
        case 'ddd': btnCategoria.classList.add('active'); break;
        case 'feriados': btnCategoria.classList.add('active'); break;
    }
}


/**
 * Gera tabela dinâmica a partir do array de dados retornados da API
 * @param {array} data 
 */
function generateTable(data, tableId) {

    const table = document.querySelector(`#${tableId}`);
    table.innerHTML = null; // Limpa tabela caso algum dado anterior exista

    // Cria cabecalho e corpo da tabela
    const header = document.createElement('thead');
    const body = document.createElement('tbody');

    // Caso seja retornado apenas um objeto, coloca ele dentro de um array para poder realizar operações abaixo
    const registros = Array.isArray(data) ? data : [data];

    // Monta cabecalho da tabela dinamicamente
    Object.keys(registros[0]).forEach(col => {
        const th = document.createElement('th');
        th.innerHTML = col;
        header.appendChild(th);
    });
    table.append(header);

    // Monta corpo da tabela dinamicamente
    registros.forEach(row => {
        // Cria linha
        const tr = document.createElement('tr');

        // Cria células
        Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.innerHTML = typeof(cell) === 'object' ? JSON.stringify(cell ?? 0) : cell;
            tr.appendChild(td);
        });

        // Adiciona linhas com células ao corpo da tabela
        body.appendChild(tr);
    });

    // Adiciona corpo a tabela
    table.append(body);

}

/**
 * Busca dados do form especificado
 * @param {object} formEvent 
 */
function fetchData(formEvent) {
    formEvent.preventDefault();

    // Inicia variáveis para endpoint e parametro de pesquisa
    let endpoint = '';
    let param = this.param.value ?? '';

    // Com exceção dos bancos, todos os outros endpoints precisam de um parametro de pesquisa
    if (this.name !== 'bancos_form' && !param) {
        return alert("É necessário informar um termo de pesquisa!");
    }

    // Define endpoint de acordo com o form
    switch (this.name) {
        case 'bancos_form': endpoint = 'banks/v1'; break;
        case 'ceps_form': endpoint = 'cep/v2'; break;
        case 'cnpj_form': endpoint = 'cnpj/v1'; break;
        case 'ddd_form': endpoint = 'ddd/v1'; break;
        case 'feriados_form': endpoint = 'feriados/v1'; break;
    }

    // Monta URL
    let url = `https://brasilapi.com.br/api/${endpoint}/${param}`;
    url = url.endsWith('/') ? url.slice(0, -1) : url;

    // Busca os Dados
    fetch(url).then(response => response.json()).then(data => {

        // Em caso de erro
        if (data.message) {
            return alert(data.message);
        }

        // Gera tabela com retorno da API
        generateTable(data, this.name.replace('form', 'table'));


    }).catch(error => {
        alert(error.message);
    })
}

// Registra eventos de envio dos formuários on page load
(() => {
    document.forms.bancos_form.addEventListener('submit', fetchData);
    document.forms.ceps_form.addEventListener('submit', fetchData);
    document.forms.cnpj_form.addEventListener('submit', fetchData);
    document.forms.ddd_form.addEventListener('submit', fetchData);
    document.forms.feriados_form.addEventListener('submit', fetchData);
})();