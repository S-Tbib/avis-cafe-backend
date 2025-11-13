# repro-test.ps1
# Usage: Open PowerShell in this folder and run: .\repro-test.ps1
# This script registers a user, logs in, prints the token and headers,
# then posts a feedback using the Bearer token and prints responses.

param(
    [string]$BaseUrl = 'http://localhost:8080'
)

$ts = [int][double]::Parse((Get-Date -UFormat %s))
$email = "repro.test+$ts@example.com"
Write-Host "BaseUrl: $BaseUrl"
Write-Host "Using email: $email"

# Register
$reg = @{ fullName='Repro Test'; email=$email; password='secret123' } | ConvertTo-Json
Write-Host "`n--- Registering ---"
try {
    $regResp = Invoke-RestMethod -Uri "$BaseUrl/api/users/register" -Method Post -Body $reg -ContentType 'application/json' -ErrorAction Stop
    Write-Host "REGISTER RESPONSE:"; $regResp | ConvertTo-Json
} catch {
    Write-Host "REGISTER FAILED:"; $_ | Format-List -Force
    exit 1
}

# Login
$login = @{ email=$email; password='secret123' } | ConvertTo-Json
Write-Host "`n--- Logging in ---"
try {
    $loginResp = Invoke-RestMethod -Uri "$BaseUrl/api/users/login" -Method Post -Body $login -ContentType 'application/json' -ErrorAction Stop
    Write-Host "LOGIN RESPONSE:"; $loginResp | ConvertTo-Json
    $token = $loginResp.token
    if (-not $token) { Write-Host "No token returned by login"; exit 1 }
    Write-Host "Token length: $($token.Length)"
} catch {
    Write-Host "LOGIN FAILED:"; $_ | Format-List -Force
    exit 1
}

# Show what header will look like (masked token for safety)
$masked = $token.Substring(0,10) + '...' + $token.Substring($token.Length-10)
Write-Host "Authorization header (masked): Bearer $masked"

# Post feedback
Write-Host "`n--- Posting feedback ---"
$fb = @{ date = (Get-Date).ToString('s'); tableNumber='R1'; rating=5; name='Repro'; comment='Automated repro test' } | ConvertTo-Json
try {
    $headers = @{ Authorization = "Bearer $token" }
    $postResp = Invoke-RestMethod -Uri "$BaseUrl/api/feedback" -Method Post -Body $fb -ContentType 'application/json' -Headers $headers -ErrorAction Stop
    Write-Host "POST FEEDBACK RESPONSE:"; $postResp | ConvertTo-Json
} catch {
    Write-Host "POST FEEDBACK FAILED:"; $_ | Format-List -Force
    # Show response headers if available
    if ($_.Exception.Response) {
        try { $r = $_.Exception.Response; $sr = New-Object System.IO.StreamReader($r.GetResponseStream()); $text = $sr.ReadToEnd(); Write-Host "Response body:"; Write-Host $text } catch { }
    }
    exit 1
}

Write-Host "`nScript finished successfully."
