Add-Type -AssemblyName System.Drawing

$sourcePath = "$PSScriptRoot\logo.png"
$destPath = "$PSScriptRoot\favicon.png"
$size = 256

Write-Host "Processing $sourcePath to $destPath"

if (-not (Test-Path $sourcePath)) {
    Write-Error "Source file not found: $sourcePath"
    exit 1
}

try {
    $img = [System.Drawing.Image]::FromFile($sourcePath)
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)

    $g.Clear([System.Drawing.Color]::Transparent)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Calculate dimensions to contain
    $ratio = [Math]::Min($size / $img.Width, $size / $img.Height)
    $w = [int]($img.Width * $ratio)
    $h = [int]($img.Height * $ratio)
    $x = [int](($size - $w) / 2)
    $y = [int](($size - $h) / 2)

    $g.DrawImage($img, $x, $y, $w, $h)

    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Created $destPath"
} catch {
    Write-Error "Error processing image: $_"
    exit 1
} finally {
    if ($img) { $img.Dispose() }
    if ($g) { $g.Dispose() }
    if ($bmp) { $bmp.Dispose() }
}
