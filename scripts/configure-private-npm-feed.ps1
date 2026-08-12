# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$npmrcPath = Join-Path $repositoryRoot ".npmrc"
$privateRegistry = "https://microsoftgraph.pkgs.visualstudio.com/0985d294-5762-4bc2-a565-161ef349ca3e/_packaging/GraphDeveloperExperiences_Public/npm/registry/"
$publicRegistry = "https://registry.npmjs.org/"

if (Test-Path -LiteralPath $npmrcPath) {
    Remove-Item -LiteralPath $npmrcPath -Force
}

& npm install --global ado-npm-auth "--registry=$publicRegistry"
if ($LASTEXITCODE -ne 0) {
    throw "Unable to install ado-npm-auth."
}

@"
registry=$privateRegistry
always-auth=true
"@ | Set-Content -LiteralPath $npmrcPath -Encoding utf8

& ado-npm-auth -c $npmrcPath
if ($LASTEXITCODE -ne 0) {
    throw "Unable to authenticate to the Azure Artifacts npm feed."
}

& npm cache clean --force
if ($LASTEXITCODE -ne 0) {
    throw "Unable to clear the npm cache."
}

Write-Host "The private npm feed is configured. Run 'npm ci' to restore dependencies."
