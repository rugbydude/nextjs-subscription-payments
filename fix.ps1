# test-auth-flows.ps1

$ErrorActionPreference = "Stop"

Write-Host "Testing Authentication Flows..." -ForegroundColor Cyan

# Test URLs
$urls = @(
    "http://localhost:8080/signin",
    "http://localhost:8080/signup"
)

# Function to test URL accessibility
function Test-Endpoint {
    param($url)
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ $url is accessible" -ForegroundColor Green
            
            # Check for key elements
            if ($response.Content -match "supabase") {
                Write-Host "  ✓ Supabase auth components found" -ForegroundColor Green
            } else {
                Write-Host "  ⨯ Supabase auth components not found" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "⨯ Failed to access $url" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

# Check if server is running
try {
    $serverCheck = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5
    Write-Host "✓ Development server is running" -ForegroundColor Green
} catch {
    Write-Host "⨯ Development server is not running" -ForegroundColor Red
    Write-Host "Please start the server with: pnpm dev" -ForegroundColor Yellow
    exit 1
}

# Test each endpoint
foreach ($url in $urls) {
    Test-Endpoint $url
}

Write-Host "`nManual Testing Steps:" -ForegroundColor Yellow
Write-Host "1. Open browser to http://localhost:8080/signin" -ForegroundColor White
Write-Host "2. Try signing in with test credentials" -ForegroundColor White
Write-Host "3. Check browser console for auth events" -ForegroundColor White
Write-Host "4. Verify redirect to /dashboard after success" -ForegroundColor White