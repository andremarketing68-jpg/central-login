// ======== CONFIGURAÇÃO (preencha com os dados do seu projeto Supabase) ========
// Supabase > Project Settings > API (ou "API Keys")
window.CENTRAL_CONFIG = {
  SUPABASE_URL: 'https://xhjsbprtaridthmssrai.supabase.co',
  SUPABASE_KEY: 'sb_publishable_oBZyeEGupHJFqPlakOhMTg_Mi29bmC6', // "anon public" ou "publishable" — NUNCA a service_role/secret

  // Opcional: só entrega o login para estes sites (ex.: 'https://portal.amil.com.br').
  // Deixe vazio [] para aceitar qualquer portal.
  ORIGENS_PERMITIDAS: [],

  // Arquivo dos robôs no Gist (usado pela "ponte" nos portais que bloqueiam conexões externas)
  CODIGO_URL: 'https://gist.githubusercontent.com/andremarketing68-jpg/aabe65494b8ed6b659e6c0ed1c69828b/raw/central-teste.js'
};

// Chamada às funções do banco (compartilhada pelas páginas)
window.centralRpc = async function (fn, args) {
  const c = window.CENTRAL_CONFIG;
  const headers = { 'Content-Type': 'application/json', apikey: c.SUPABASE_KEY };
  if (c.SUPABASE_KEY.startsWith('eyJ')) headers.Authorization = 'Bearer ' + c.SUPABASE_KEY;
  const resp = await fetch(c.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/rpc/' + fn, {
    method: 'POST', headers, body: JSON.stringify(args)
  });
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(dados.message || ('Erro ' + resp.status));
  return dados;
};

// Identificador deste computador/navegador (gerado uma vez e guardado)
window.centralDispositivo = function () {
  let id = localStorage.getItem('central_dispositivo');
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
    localStorage.setItem('central_dispositivo', id);
  }
  return id;
};

window.centralSessao = {
  ler() {
    try {
      const s = JSON.parse(localStorage.getItem('central_sessao') || 'null');
      if (s && new Date(s.valido_ate) > new Date()) return s;
    } catch (e) {}
    localStorage.removeItem('central_sessao');
    return null;
  },
  salvar(s) { localStorage.setItem('central_sessao', JSON.stringify(s)); },
  limpar() { localStorage.removeItem('central_sessao'); }
};

window.centralNavegador = function () {
  const ua = navigator.userAgent;
  const nav = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : 'Navegador';
  const so = /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : '';
  return nav + (so ? ' / ' + so : '') + ' · ' + window.centralDispositivo().slice(0, 8);
};
