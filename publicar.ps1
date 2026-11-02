# Publica a app no GitHub Pages: valida, faz commit e push da branch main.
# Uso:  .\publicar.ps1 "Mensagem do commit"
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Mensagem
)

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Falha([string]$texto) {
    Write-Host "ERRO: $texto" -ForegroundColor Red
    exit 1
}

# 1. Branch certa
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($branch -ne 'main') { Falha "Você está na branch '$branch'. Publique a partir da 'main'." }

git fetch --quiet origin main
if ($LASTEXITCODE -ne 0) { Falha 'Não consegui falar com o GitHub (sem internet?).' }

# 2. Dados: índice e todos os arquivos referenciados precisam carregar
Write-Host 'Validando data/ ...'
try {
    $indice = Get-Content -LiteralPath 'data/indice.json' -Raw -Encoding UTF8 | ConvertFrom-Json
} catch { Falha "data/indice.json inválido: $($_.Exception.Message)" }

foreach ($u in $indice.unidades) {
    $arq = Join-Path 'data' $u.arquivo
    $res = Join-Path 'data' $u.resumo
    if (-not (Test-Path -LiteralPath $arq)) { Falha "Falta $arq (unidade $($u.id))." }
    if (-not (Test-Path -LiteralPath $res)) { Falha "Falta $res (unidade $($u.id))." }
    try {
        $d = Get-Content -LiteralPath $arq -Raw -Encoding UTF8 | ConvertFrom-Json
    } catch { Falha "$arq inválido: $($_.Exception.Message)" }
    Write-Host ("  {0,-16} {1,4} perguntas  {2,4} flashcards" -f $u.id, @($d.perguntas).Count, @($d.flashcards).Count)
}
Write-Host "  Índice versão $($indice.versao)"

# 3. Material do curso nunca entra no repo
git add -A
$proibidos = git diff --cached --name-only origin/main | Where-Object { $_ -match '\.(pdf|odp|pptx|xlsx|docx)$' -or $_ -match '(^|/)PROVA' -or $_ -match '^_app_conteudo/' }
if ($proibidos) {
    git reset --quiet
    Falha "Arquivos do curso não podem ir para o repo público:`n  $($proibidos -join "`n  ")"
}

# 4. Mudou a app? Então VERSAO em sw.js tem que ter subido
$mudados = git diff --cached --name-only origin/main
if (-not $mudados) {
    git reset --quiet
    Write-Host 'Nada para publicar.' -ForegroundColor Yellow
    exit 0
}
$naoApp = '^(data/|CLAUDE\.md$|publicar\.ps1$|\.gitignore$|\.gitattributes$|README)'
$app = $mudados | Where-Object { $_ -notmatch $naoApp }
if ($app) {
    $subiu = git diff --cached origin/main -- sw.js | Select-String -Pattern '^\+const VERSAO' -Quiet
    if (-not $subiu) {
        git reset --quiet
        Falha "Arquivos da app mudaram ($($app -join ', ')), mas VERSAO em sw.js não subiu. Aumente VERSAO e rode de novo."
    }
}

# 5. Commit e push
Write-Host 'Arquivos que vão subir:'
$mudados | ForEach-Object { Write-Host "  $_" }

git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit --quiet -m $Mensagem
    if ($LASTEXITCODE -ne 0) { Falha 'O commit falhou.' }
}
git push --quiet origin main
if ($LASTEXITCODE -ne 0) { Falha 'O push falhou.' }

Write-Host ''
Write-Host 'Publicado. Em 1–2 minutos estará em https://vraffo-star.github.io/app-fluidos/' -ForegroundColor Green
if ($app) {
    Write-Host 'No celular: abra a app com internet; vai aparecer "Atualização disponível — tocar para recarregar".'
} else {
    Write-Host 'No celular: abra a app com internet; os dados novos chegam sozinhos.'
}
