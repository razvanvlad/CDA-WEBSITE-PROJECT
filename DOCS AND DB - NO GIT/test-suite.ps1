# CDA Website Test Suite - PowerShell Version
# Comprehensive testing script for Windows systems

param(
    [string]$BaseUrl = "http://localhost:3003",
    [string]$GraphQLEndpoint = "http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql"
)

# Configuration
$TestConfig = @{
    BaseUrl = $BaseUrl
    GraphQLEndpoint = $GraphQLEndpoint
    Routes = @("/", "/services", "/case-studies", "/team", "/about", "/contact")
    TestImages = @("/favicon.ico", "/_next/static/media/logo.png")
    Viewports = @{
        Mobile = @{ Width = 375; Height = 667; Name = "Mobile (iPhone SE)" }
        Tablet = @{ Width = 768; Height = 1024; Name = "Tablet (iPad)" }
        Desktop = @{ Width = 1920; Height = 1080; Name = "Desktop (1920x1080)" }
    }
}

# GraphQL Queries
$GraphQLQueries = @{
    services = "query TestServices { services(first: 5) { nodes { id title slug } pageInfo { hasNextPage } } }"
    caseStudies = "query TestCaseStudies { caseStudies(first: 5) { nodes { id title slug } } }"
    teamMembers = "query TestTeamMembers { teamMembers(first: 5) { nodes { id title slug } } }"
    serviceTypes = "query TestServiceTypes { serviceTypes { nodes { id name slug } } }"
    projectTypes = "query TestProjectTypes { projectTypes { nodes { id name slug } } }"
    departments = "query TestDepartments { departments { nodes { id name slug } } }"
}

# Test Results
$TestResults = @{
    StartTime = Get-Date
    Tests = @()
    Summary = @{
        Total = 0
        Passed = 0
        Failed = 0
        Warnings = 0
    }
}

function Write-TestLog {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    Add-Content -Path "test-results.log" -Value $logEntry
}

function Add-TestResult {
    param(
        [string]$TestName,
        [string]$Status,
        [string]$Details = "",
        [string]$Error = "",
        [string]$Warning = ""
    )
    
    $test = @{
        Name = $TestName
        Status = $Status
        Timestamp = Get-Date
        Details = $Details
        Error = $Error
        Warning = $Warning
    }
    
    $TestResults.Tests += $test
    $TestResults.Summary.Total++
    
    switch ($Status) {
        "PASS" {
            $TestResults.Summary.Passed++
            Write-TestLog "✅ PASS: $TestName" "PASS"
            if ($Details) { Write-TestLog "    Details: $Details" }
        }
        "FAIL" {
            $TestResults.Summary.Failed++
            Write-TestLog "❌ FAIL: $TestName - $Error" "FAIL"
            if ($Details) { Write-TestLog "    Details: $Details" }
        }
        "WARN" {
            $TestResults.Summary.Warnings++
            Write-TestLog "⚠️  WARN: $TestName - $Warning" "WARN"
            if ($Details) { Write-TestLog "    Details: $Details" }
        }
    }
}

function Test-HttpEndpoint {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 10
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSeconds -ErrorAction Stop
        return @{
            StatusCode = $response.StatusCode
            ContentType = $response.Headers["Content-Type"]
            Success = $true
            ResponseTime = 0  # PowerShell doesn't easily provide this
        }
    }
    catch {
        return @{
            StatusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 0 }
            Error = $_.Exception.Message
            Success = $false
        }
    }
}

function Test-GraphQLQuery {
    param(
        [string]$Query,
        [string]$Endpoint
    )
    
    try {
        $body = @{ query = $Query } | ConvertTo-Json -Compress
        $headers = @{ "Content-Type" = "application/json" }
        
        $response = Invoke-RestMethod -Uri $Endpoint -Method POST -Body $body -Headers $headers -TimeoutSec 15 -ErrorAction Stop
        
        if ($response.errors -and $response.errors.Count -gt 0) {
            return @{
                Success = $false
                HasWarnings = $true
                Errors = $response.errors
                Data = $response.data
            }
        } elseif ($response.data) {
            $hasData = $false
            foreach ($key in $response.data.PSObject.Properties.Name) {
                $data = $response.data.$key
                if ($data -and (($data.nodes -and $data.nodes.Count -gt 0) -or ($data -is [array] -and $data.Count -gt 0))) {
                    $hasData = $true
                    break
                }
            }
            return @{
                Success = $true
                HasData = $hasData
                Data = $response.data
            }
        } else {
            return @{
                Success = $false
                Error = "No data returned"
            }
        }
    }
    catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Initialize log file
if (Test-Path "test-results.log") {
    Remove-Item "test-results.log"
}

Write-Host "🚀 CDA Website Test Suite - PowerShell Edition" -ForegroundColor Cyan
Write-Host "📅 $(Get-Date)" -ForegroundColor Gray
Write-Host ""

Write-TestLog "============================================================"
Write-TestLog "CDA WEBSITE TEST SUITE - PowerShell Edition"
Write-TestLog "============================================================"
Write-TestLog "🚀 Starting comprehensive test suite..."

# Test 1: Server Availability
Write-TestLog "🔍 Testing server availability..."
$serverTest = Test-HttpEndpoint -Url $TestConfig.BaseUrl
if ($serverTest.Success -and $serverTest.StatusCode -eq 200) {
    Add-TestResult -TestName "Server Availability" -Status "PASS" -Details "Server responding at $($TestConfig.BaseUrl)"
} else {
    Add-TestResult -TestName "Server Availability" -Status "FAIL" -Error "Server not accessible" -Details "Status: $($serverTest.StatusCode), Error: $($serverTest.Error)"
}

# Test 2: GraphQL Queries
Write-TestLog "🔍 Testing GraphQL queries..."
foreach ($queryPair in $GraphQLQueries.GetEnumerator()) {
    $queryName = $queryPair.Key
    $query = $queryPair.Value
    
    $result = Test-GraphQLQuery -Query $query -Endpoint $TestConfig.GraphQLEndpoint
    
    if ($result.Success) {
        if ($result.HasData) {
            Add-TestResult -TestName "GraphQL Query: $queryName" -Status "PASS" -Details "Query returned data successfully"
        } else {
            Add-TestResult -TestName "GraphQL Query: $queryName" -Status "WARN" -Warning "Query succeeded but no data returned"
        }
    } elseif ($result.HasWarnings) {
        $errorMessages = $result.Errors | ForEach-Object { $_.message } | Join-String -Separator ", "
        Add-TestResult -TestName "GraphQL Query: $queryName" -Status "WARN" -Warning "Query has errors but may return data" -Details "Errors: $errorMessages"
    } else {
        Add-TestResult -TestName "GraphQL Query: $queryName" -Status "FAIL" -Error $result.Error
    }
}

# Test 3: Routes
Write-TestLog "🔍 Testing routes..."
foreach ($route in $TestConfig.Routes) {
    $url = $TestConfig.BaseUrl + $route
    $result = Test-HttpEndpoint -Url $url
    
    if ($result.Success -and $result.StatusCode -eq 200) {
        Add-TestResult -TestName "Route: $route" -Status "PASS" -Details "Status: $($result.StatusCode), Content-Type: $($result.ContentType)"
    } elseif ($result.StatusCode -eq 404 -and $route -eq "/404") {
        Add-TestResult -TestName "Route: $route" -Status "PASS" -Details "Expected 404 for error page"
    } else {
        Add-TestResult -TestName "Route: $route" -Status "FAIL" -Error "Expected 200, got $($result.StatusCode)" -Details $result.Error
    }
}

# Test 4: Image Loading
Write-TestLog "🔍 Testing image loading..."
foreach ($imagePath in $TestConfig.TestImages) {
    $url = $TestConfig.BaseUrl + $imagePath
    $result = Test-HttpEndpoint -Url $url
    
    if ($result.Success -and $result.StatusCode -eq 200) {
        if ($result.ContentType -and $result.ContentType -like "*image*") {
            Add-TestResult -TestName "Image: $imagePath" -Status "PASS" -Details "Status: $($result.StatusCode), Content-Type: $($result.ContentType)"
        } else {
            Add-TestResult -TestName "Image: $imagePath" -Status "WARN" -Warning "Unexpected content type" -Details "Content-Type: $($result.ContentType)"
        }
    } elseif ($result.StatusCode -eq 404) {
        Add-TestResult -TestName "Image: $imagePath" -Status "WARN" -Warning "Image not found (may not exist)" -Details "URL: $url"
    } else {
        Add-TestResult -TestName "Image: $imagePath" -Status "FAIL" -Error "Status $($result.StatusCode)" -Details $result.Error
    }
}

# Test Next.js image optimization
$optimizedImageUrl = "$($TestConfig.BaseUrl)/_next/image?url=%2Ffavicon.ico&w=64&q=75"
$result = Test-HttpEndpoint -Url $optimizedImageUrl
if ($result.Success -and $result.StatusCode -eq 200) {
    Add-TestResult -TestName "Next.js Image Optimization" -Status "PASS" -Details "Image optimization endpoint responding"
} else {
    Add-TestResult -TestName "Next.js Image Optimization" -Status "WARN" -Warning "Image optimization may not be configured" -Details "Status: $($result.StatusCode)"
}

# Test 5: Responsive Design
Write-TestLog "🔍 Testing responsive design..."

# Test viewport meta tag
$mainPageResult = Test-HttpEndpoint -Url $TestConfig.BaseUrl
if ($mainPageResult.Success) {
    try {
        $content = Invoke-WebRequest -Uri $TestConfig.BaseUrl -UseBasicParsing
        if ($content.Content -like "*viewport*") {
            Add-TestResult -TestName "Responsive Meta Tag" -Status "PASS" -Details "Viewport meta tag detected in HTML"
        } else {
            Add-TestResult -TestName "Responsive Meta Tag" -Status "WARN" -Warning "Viewport meta tag not found"
        }
    }
    catch {
        Add-TestResult -TestName "Responsive Meta Tag" -Status "WARN" -Warning "Could not check meta tags"
    }
} else {
    Add-TestResult -TestName "Responsive Meta Tag" -Status "FAIL" -Error "Could not load main page"
}

# Test mobile user agent
try {
    $mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15"
    $headers = @{ "User-Agent" = $mobileUA }
    $response = Invoke-WebRequest -Uri $TestConfig.BaseUrl -Headers $headers -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Add-TestResult -TestName "Mobile User Agent Response" -Status "PASS" -Details "Page loads with mobile user agent"
    } else {
        Add-TestResult -TestName "Mobile User Agent Response" -Status "FAIL" -Error "Failed with mobile user agent"
    }
}
catch {
    Add-TestResult -TestName "Mobile User Agent Response" -Status "WARN" -Warning "Could not test mobile user agent"
}

# Test 6: Performance
Write-TestLog "🔍 Testing performance..."
$performanceRoutes = @("/", "/services", "/case-studies", "/team")
$totalTime = 0
$successfulTests = 0

foreach ($route in $performanceRoutes) {
    $url = $TestConfig.BaseUrl + $route
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    try {
        $result = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
        $stopwatch.Stop()
        $responseTime = $stopwatch.ElapsedMilliseconds
        
        $totalTime += $responseTime
        $successfulTests++
        
        if ($responseTime -lt 2000) {
            Add-TestResult -TestName "Performance: $route" -Status "PASS" -Details "Load time: ${responseTime}ms (< 2s target)"
        } elseif ($responseTime -lt 5000) {
            Add-TestResult -TestName "Performance: $route" -Status "WARN" -Warning "Load time: ${responseTime}ms (slow but acceptable)"
        } else {
            Add-TestResult -TestName "Performance: $route" -Status "FAIL" -Error "Load time: ${responseTime}ms (too slow)"
        }
    }
    catch {
        $stopwatch.Stop()
        Add-TestResult -TestName "Performance: $route" -Status "FAIL" -Error "Performance test failed" -Details $_.Exception.Message
    }
}

# Overall performance summary
if ($successfulTests -gt 0) {
    $avgTime = $totalTime / $successfulTests
    if ($avgTime -lt 3000) {
        Add-TestResult -TestName "Overall Performance" -Status "PASS" -Details "Average load time: ${avgTime}ms across $successfulTests routes"
    } else {
        Add-TestResult -TestName "Overall Performance" -Status "WARN" -Warning "Average load time is high" -Details "Average: ${avgTime}ms"
    }
}

# Generate final report
$TestResults.EndTime = Get-Date
$TestResults.Duration = ($TestResults.EndTime - $TestResults.StartTime).TotalSeconds

$reportPath = "test-report.json"
$TestResults | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding UTF8

Write-TestLog "============================================================"
Write-TestLog "TEST SUITE COMPLETED"
Write-TestLog "============================================================"
Write-TestLog "📊 SUMMARY:"
Write-TestLog "   Total Tests: $($TestResults.Summary.Total)"
Write-TestLog "   ✅ Passed: $($TestResults.Summary.Passed)"
Write-TestLog "   ❌ Failed: $($TestResults.Summary.Failed)"
Write-TestLog "   ⚠️  Warnings: $($TestResults.Summary.Warnings)"
Write-TestLog "   ⏱️  Duration: $([math]::Round($TestResults.Duration))s"
Write-TestLog "📄 Detailed report saved to: $reportPath"
Write-TestLog "============================================================"

# Display summary in console with colors
Write-Host "`n============================================================" -ForegroundColor Yellow
Write-Host "TEST SUITE COMPLETED" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "📊 SUMMARY:" -ForegroundColor White
Write-Host "   Total Tests: $($TestResults.Summary.Total)" -ForegroundColor White
Write-Host "   ✅ Passed: $($TestResults.Summary.Passed)" -ForegroundColor Green
Write-Host "   ❌ Failed: $($TestResults.Summary.Failed)" -ForegroundColor Red
Write-Host "   ⚠️  Warnings: $($TestResults.Summary.Warnings)" -ForegroundColor Yellow
Write-Host "   ⏱️  Duration: $([math]::Round($TestResults.Duration))s" -ForegroundColor White
Write-Host "📄 Detailed report saved to: $reportPath" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Yellow

# Exit with appropriate code
if ($TestResults.Summary.Failed -gt 0) {
    exit 1
} else {
    exit 0
}