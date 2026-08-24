param(
  [ValidateRange(1, 65535)]
  [int]$Port = 8000
)

$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath($PSScriptRoot)
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)

function Get-ContentType([string]$Path) {
  switch ([IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    '.html'  { 'text/html; charset=utf-8' }
    '.css'   { 'text/css; charset=utf-8' }
    '.js'    { 'application/javascript; charset=utf-8' }
    '.json'  { 'application/json; charset=utf-8' }
    '.svg'   { 'image/svg+xml' }
    '.png'   { 'image/png' }
    '.jpg'   { 'image/jpeg' }
    '.jpeg'  { 'image/jpeg' }
    '.webp'  { 'image/webp' }
    '.gif'   { 'image/gif' }
    '.woff'  { 'font/woff' }
    '.woff2' { 'font/woff2' }
    default  { 'application/octet-stream' }
  }
}

try {
  $listener.Start()
  Write-Host "Cortex Quant Trader disponible en:" -ForegroundColor Cyan
  Write-Host "http://127.0.0.1:$Port/index.html" -ForegroundColor White
  Write-Host "Presiona Ctrl+C para detener el servidor." -ForegroundColor DarkGray

  while ($true) {
    $client = $null

    try {
      $client = $listener.AcceptTcpClient()
      $stream = $client.GetStream()
      $reader = [IO.StreamReader]::new(
        $stream,
        [Text.Encoding]::ASCII,
        $false,
        4096,
        $true
      )

      $requestLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($requestLine)) {
        continue
      }

      do {
        $line = $reader.ReadLine()
      } while ($null -ne $line -and $line -ne '')

      $parts = $requestLine.Split(' ')
      $method = $parts[0]
      $rawPath = if ($parts.Count -gt 1) {
        $parts[1].Split('?')[0]
      } else {
        '/'
      }

      $relative = [Uri]::UnescapeDataString($rawPath.TrimStart('/'))
      $relative = $relative.Replace('/', [IO.Path]::DirectorySeparatorChar)
      if ([string]::IsNullOrWhiteSpace($relative)) {
        $relative = 'index.html'
      }

      $target = [IO.Path]::GetFullPath((Join-Path $root $relative))
      $status = '200 OK'
      $contentType = 'application/octet-stream'
      $body = [byte[]]@()

      if (-not $target.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
        $status = '403 Forbidden'
        $contentType = 'text/plain; charset=utf-8'
        $body = [Text.Encoding]::UTF8.GetBytes('Forbidden')
      } else {
        if (Test-Path -LiteralPath $target -PathType Container) {
          $target = Join-Path $target 'index.html'
        }

        if (Test-Path -LiteralPath $target -PathType Leaf) {
          $body = [IO.File]::ReadAllBytes($target)
          $contentType = Get-ContentType $target
        } else {
          $status = '404 Not Found'
          $contentType = 'text/plain; charset=utf-8'
          $body = [Text.Encoding]::UTF8.GetBytes('Not Found')
        }
      }

      $header = "HTTP/1.1 $status`r`n" +
        "Content-Type: $contentType`r`n" +
        "Content-Length: $($body.Length)`r`n" +
        "Cache-Control: no-store`r`n" +
        "Connection: close`r`n`r`n"

      $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($headerBytes, 0, $headerBytes.Length)

      if ($method -ne 'HEAD' -and $body.Length -gt 0) {
        $stream.Write($body, 0, $body.Length)
      }

      $stream.Flush()
    } catch {
      Write-Warning $_.Exception.Message
    } finally {
      if ($client) {
        $client.Close()
      }
    }
  }
} finally {
  $listener.Stop()
}
