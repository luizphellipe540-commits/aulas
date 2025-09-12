
# Plataforma de Aulas – Tema Verde Militar (React + Vite + Tailwind)

## Rodar localmente
```bash
npm install
npm run dev
```

Acesse http://localhost:5173

### Login (fixo)
- Email: `cliente713@umpicnic.com`
- Senha: `c713`

## Build
```bash
npm run build
npm run preview
```


---

## Deploy no Netlify

### Opção A — Painel Web
1. Crie uma conta em https://app.netlify.com/ e clique em **Add new site → Import an existing project**.
2. Se usar GitHub/GitLab/Bitbucket, suba este projeto num repositório e selecione-o.
3. **Build command:** `npm run build`  
   **Publish directory:** `dist`
4. Clique **Deploy**.

### Opção B — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
# Dentro da pasta do projeto:
netlify init        # escolha um site novo ou existente
netlify deploy --build --prod
# (O --build roda `npm run build` conforme netlify.toml)
```
> A configuração SPA já está pronta em `netlify.toml` (redirect 200 para `/index.html`).

### Variáveis (se precisar)
- Configure em **Site settings → Build & deploy → Environment**.

