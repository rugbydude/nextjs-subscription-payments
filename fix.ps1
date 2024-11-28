# Base URL for the API
$baseUrl = "https://api.example.com" # Replace with your actual base URL

# Function to create a user story
function New-UserStory {
    param (
        [string]$Title,
        [string]$Description,
        [string]$AcceptanceCriteria
    )

    # Validate required parameters
    if (-not $Title -or -not $Description) {
        throw "Title and Description are required parameters."
    }

    $body = @{
        title = $Title
        description = $Description
        acceptance_criteria = $AcceptanceCriteria
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/user_stories" -Method Post -Body $body -ContentType "application/json"
        return $response
    } catch {
        Write-Error "Failed to create user story: $_"
    }
}

# Function to get all user stories for an epic
function Get-UserStoriesByEpic {
    param (
        [string]$EpicId
    )

    # Validate required parameter
    if (-not $EpicId) {
        throw "EpicId is a required parameter."
    }

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/user_stories?epic_id=$EpicId" -Method Get
        return $response
    } catch {
        Write-Error "Failed to retrieve user stories for epic $EpicId: $_"
    }
}

# Function to update a user story
function Update-UserStory {
    param (
        [string]$UserStoryId,
        [string]$Title,
        [string]$Description,
        [string]$AcceptanceCriteria
    )

    # Validate required parameters
    if (-not $UserStoryId -or -not $Title -or -not $Description) {
        throw "UserStoryId, Title, and Description are required parameters."
    }

    $body = @{
        title = $Title
        description = $Description
        acceptance_criteria = $AcceptanceCriteria
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/user_stories/$UserStoryId" -Method Put -Body $body -ContentType "application/json"
        return $response
    } catch {
        Write-Error "Failed to update user story $UserStoryId: $_"
    }
}

# Function to delete a user story
function Remove-UserStory {
    param (
        [string]$UserStoryId
    )

    # Validate required parameter
    if (-not $UserStoryId) {
        throw "UserStoryId is a required parameter."
    }

    try {
        Invoke-RestMethod -Uri "$baseUrl/user_stories/$UserStoryId" -Method Delete
        Write-Host "User story $UserStoryId deleted successfully."
    } catch {
        Write-Error "Failed to delete user story $UserStoryId: $_"
    }
}
