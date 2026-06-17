$csvPath = 'D:\迅雷下载\8b310c28-9d2c-49f3-8273-bcc8597e2894ExportBlock-c0df1482-64d3-465e-8654-75612a98ab6a\ExportBlock-c0df1482-64d3-465e-8654-75612a98ab6a-Part-1\galgame整理 308d9616662180afba01d1164a6cdac6_GAMEACG管理 308d961666218152b20b000b3217d5fc.csv'
$outPath = 'd:\trae_project\app\games.json'

Add-Type -AssemblyName Microsoft.VisualBasic
$parser = [Microsoft.VisualBasic.FileIO.TextFieldParser]::new($csvPath)
$parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
$parser.Delimiters = @(',')
$parser.HasFieldsEnclosedInQuotes = $true

$headers = $parser.ReadFields()
Write-Host "Headers count: $($headers.Count)"

$results = [System.Collections.ArrayList]::new()
$idCounter = 1

while (-not $parser.EndOfData) {
    $fields = $null
    try {
        $fields = $parser.ReadFields()
    } catch {
        Write-Host "Warning: skip row $($idCounter): $($_.Exception.Message)"
        continue
    }
    if ($null -eq $fields) { continue }

    $hasData = $false
    foreach ($f in $fields) { if ($f.Trim() -ne '') { $hasData = $true; break } }
    if (-not $hasData) { continue }

    $rawData = [ordered]@{}
    for ($i = 0; $i -lt $headers.Count -and $i -lt $fields.Count; $i++) {
        $rawData[$headers[$i].Trim()] = $fields[$i].Trim()
    }

    function GetVal($dict, $partialName) {
        foreach ($k in $dict.Keys) { if ($k.Contains($partialName)) { return $dict[$k] } }
        return ''
    }

    $title = GetVal $rawData ''
    $category = GetVal $rawData ''
    $ratingStr = GetVal $rawData ''
    $descRaw = GetVal $rawData ''
    $cover = GetVal $rawData ''
    $sizeStr = GetVal $rawData ''
    $updateDateStr = GetVal $rawData ''

    foreach ($k in $rawData.Keys) {
        if ($k.Contains('')) { $title = $rawData[$k] }
        if ($k.Contains('')) { $category = $rawData[$k] }
        if ($k.Contains('')) { $ratingStr = $rawData[$k] }
        if ($k.Contains('')) { $descRaw = $rawData[$k] }
        if ($k.Contains('')) { $cover = $rawData[$k] }
        if ($k.Contains('')) { $sizeStr = $rawData[$k] }
        if ($k.Contains('')) { $updateDateStr = $rawData[$k] }
    }

    $rating = 3.0
    if ($ratingStr -match 'SSS') { $rating = 5.0 }
    elseif ($ratingStr -match 'SS') { $rating = 4.5 }
    elseif ($ratingStr -match '\bS\b') { $rating = 4.0 }
    elseif ($ratingStr -match '\bA\b') { $rating = 3.0 }
    elseif ($ratingStr -match '\bB\b') { $rating = 2.0 }
    elseif ($ratingStr -match '\bX\b') { $rating = 1.0 }

    $icon = [char]0x1F3AE
    if ($cover -and $cover.Trim() -ne '' -and $cover -match '^https?://') {
        $icon = $cover.Trim()
    }

    $description = $descRaw
    if ($description.Length -gt 200) { $description = $description.Substring(0, 200) }

    $isoDate = ''
    if ($updateDateStr -match '(\d{4})\D+(\d{1,2})\D+(\d{1,2})') {
        $y = $Matches[1]; $m = [int]$Matches[2].ToString().PadLeft(2,'0'); $d = [int]$Matches[3].ToString().PadLeft(2,'0')
        $isoDate = "$y-$m-${d}T00:00:00"
    } else { $isoDate = $updateDateStr }

    $obj = [ordered]@{
        id = $idCounter; title = $title; icon = $icon; category = $category
        rating = $rating; downloads = $sizeStr; description = $description
        updateDate = $isoDate
        _rawFields = @($headers | ForEach-Object { $_.Trim() })
        _rawData = $rawData
    }
    [void]$results.Add($obj)
    $idCounter++
}

$parser.Close()
$jsonOutput = $results | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($outPath, $jsonOutput, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Done! Converted $($results.Count) records to $outPath"