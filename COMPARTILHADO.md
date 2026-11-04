# Sistema web compartilhado entre congregações

Aplicação web com interface em HTML, CSS e JavaScript e servidor/API em Node.js, sem dependências externas. O servidor central salva as alterações em `temas_compartilhado.json`.

O arquivo `temas.xlsx` mantém a aba original `Temas` e inclui as abas `Designações` e `Discursos semanais`, com os dados de `Congregações.xlsx` e `Discurso Semanal.xlsx`. O site já contém 93 designações mensais preenchidas entre 2021 e 2028. A planilha de congregações tem duas designações diferentes para janeiro de 2028 (`Andes` e `Metalurgicos`); o site mantém `Andes` e não presume que a segunda linha seja fevereiro.

Foram importados para a agenda do site os 76 registros preenchidos de discursos de 2026, associados a `Jd Iguatemi` e preservando o tipo (`RECEBEREMOS`, `ENVIAREMOS` etc.). As três datas sem dados continuam visíveis somente na aba `Discursos semanais` do Excel.

## Iniciar

No computador servidor, execute:

```powershell
cd C:\app-cordova\temas
npm start
```

Ou dê dois cliques em `run.bat`. É necessário ter Node.js instalado. O primeiro início cria `temas_compartilhado.json`; faça backup periódico desse arquivo.

## Acessar de outros dispositivos

Todos podem abrir no navegador `http://IP-DO-SERVIDOR:3000` usando a mesma rede local, por exemplo `http://192.168.1.25:3000`. Descubra o endereço com `ipconfig`; se solicitado pelo Firewall do Windows, libere acesso somente em redes privadas.

Congregações em redes diferentes podem entrar pela mesma VPN privada e acessar o IP VPN do servidor. O sistema ainda não tem login: restrinja o acesso à rede privada e não publique a porta diretamente na internet.

## Hospedagem em nuvem

O servidor grava os dados em `temas_compartilhado.json` no disco local. Isso não oferece persistência confiável no armazenamento efêmero dos planos gratuitos de hospedagem e o servidor HTTP atual não é, por si só, uma função serverless da Vercel. Antes de usar esses provedores em produção, é necessário adaptar a API e migrar os dados para um banco persistente compatível com o plano escolhido.

## Recursos

1. **Temas:** histórico separado por congregação; registros novos são compartilhados pelo servidor.
2. **Designações:** escolha o ano e a congregação designada a cada mês; inclui os dados importados da planilha.
3. **Discursos semanais:** cadastre data, orador, número e título do tema e horário.
4. **Congregações:** adicione novos grupos; eles aparecem nos seletores do sistema.
