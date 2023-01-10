# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

<# 
.Synopsis
    Reads the version from the http package definition and updates the constant in the version file. 
.Description 
    Reads the version from the http package definition and updates the constant in the version file. 
#>

$httpPackageRelativePath = "packages/http/fetch"
$packageDefinitionPath = Join-Path $PWD -ChildPath $httpPackageRelativePath -AdditionalChildPath "/package.json"
$versionFilePath = Join-Path $PWD -ChildPath $httpPackageRelativePath -AdditionalChildPath "src/middlewares/options/version.ts"

if (-not (Test-Path $packageDefinitionPath)) {
	Write-Error "Could not find package definition at path: $packageDefinitionPath"
	Exit 1
}

if (-not (Test-Path $versionFilePath)) {
	Write-Error "Could not find version file at path: $versionFilePath"
	Exit 1
}

$packageDefinition = Get-Content $packageDefinitionPath | ConvertFrom-Json
$version = $packageDefinition.version
Set-Content $versionFilePath -Value "export const libraryVersion = ""$version"";" -Verbose