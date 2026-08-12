# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$npmrcPath = Join-Path $repositoryRoot ".npmrc"
$privateRegistry = "https://microsoftgraph.pkgs.visualstudio.com/0985d294-5762-4bc2-a565-161ef349ca3e/_packaging/GraphDeveloperExperiences_Public/npm/registry/"

@"
registry=$privateRegistry
always-auth=true
"@ | Set-Content -LiteralPath $npmrcPath -Encoding utf8

$previousRegistry = $env:npm_config_registry
$env:npm_config_registry = "https://registry.npmjs.org/"

try {
    & npx --yes ado-npm-auth -c $npmrcPath
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to authenticate to the Azure Artifacts npm feed."
    }
}
finally {
    $env:npm_config_registry = $previousRegistry
}

& npm cache clean --force
if ($LASTEXITCODE -ne 0) {
    throw "Unable to clear the npm cache."
}

Write-Host "The private npm feed is configured. Run 'npm ci' to restore dependencies."
