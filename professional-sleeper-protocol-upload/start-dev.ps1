$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$viteEntry = Join-Path $projectRoot "node_modules\vite\bin\vite.js"

if (-not (Test-Path $viteEntry)) {
  throw "Nu găsesc Vite în node_modules. Verifică dacă dependențele proiectului sunt instalate."
}

if (Test-Path $bundledNode) {
  $node = $bundledNode
} else {
  $node = "node"
}

Set-Location $projectRoot
& $node $viteEntry --host 127.0.0.1 --port 5174
