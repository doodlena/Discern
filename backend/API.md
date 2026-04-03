# 📡 DISCERN API Documentation

Complete API reference for the DISCERN backend.

**Base URL:** `http://localhost:3001` (development) or `https://your-api.railway.app` (production)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Analysis Endpoints](#analysis-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Health Check](#health-check)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## Authentication

Most endpoints are public. Admin endpoints require authentication.

### Admin Authentication

**Headers:**
```
Authorization: Bearer {admin-token}
```

---

## Analysis Endpoints

### POST /api/analyze

Analyze content for credibility.

**Request Body:**
```json
{
  "type": "url" | "text" | "pdf",
  "content": "string",  // URL, text, or base64 PDF
  "demoMode": false,    // optional
  "explainabilityMode": false  // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxx...",
    "score": 82,
    "confidence": "high",
    "summary": "This article demonstrates strong credibility...",
    "citations": [
      {
        "claim": "Climate change is accelerating",
        "source": "IPCC Report 2023",
        "reliability": "high",
        "supports": true,
        "excerpt": "...",
        "url": "https://..."
      }
    ],
    "factors": {
      "bias": 5,
      "source_reputation": 22,
      "evidence": 25,
      "logic": 23
    },
    "warnings": [],
    "processingSteps": [...]  // Only in explainability mode
  },
  "processingTime": 12500
}
```

**Example - URL Analysis:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "type": "url",
    "content": "https://www.nature.com/articles/example"
  }'
```

**Example - Text Analysis:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "content": "Your article text here..."
  }'
```

**Example - PDF Analysis:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pdf",
    "content": "data:application/pdf;base64,JVBERi0xLj..."
  }'
```

**Errors:**
- `400` - Invalid request (missing fields, invalid type)
- `500` - Analysis failed

---

### GET /api/analyze/demo

Get available demo content for demo mode.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "demo-001",
      "title": "Climate Change: IPCC Report",
      "url": "https://www.ipcc.ch/...",
      "category": "science",
      "expectedScore": 95
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3001/api/analyze/demo
```

---

## Admin Endpoints

### POST /api/admin/login

Authenticate as admin.

**Request Body:**
```json
{
  "password": "admin-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "admin-authenticated",
    "message": "Admin access granted"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "your-admin-password"
  }'
```

**Errors:**
- `401` - Invalid credentials

---

### GET /api/admin/analytics

Get analytics metrics for dashboard.

**Query Parameters:**
- `days` (optional, default: 30) - Number of days to include

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAnalyses": 1523,
    "averageScore": 72.5,
    "scoreDistribution": {
      "low": 234,
      "medium": 789,
      "high": 500
    },
    "contentTypeBreakdown": {
      "url": 1200,
      "text": 250,
      "pdf": 73
    },
    "topDomains": [
      {
        "domain": "nytimes.com",
        "count": 45,
        "averageScore": 85.2
      }
    ],
    "dailyAnalyses": [
      {
        "date": "2024-03-01",
        "count": 52
      }
    ],
    "lowCredibilityCount": 234
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/admin/analytics?days=7 \
  -H "Authorization: Bearer admin-authenticated"
```

**Errors:**
- `401` - Not authenticated
- `403` - Unauthorized

---

### GET /api/admin/stats

Get quick statistics for admin dashboard.

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScans": 1523,
    "averageScore": 72.5,
    "lowCredibilityPercentage": 15,
    "topFlaggedSource": "example.com"
  }
}
```

**Example:**
```bash
curl http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer admin-authenticated"
```

---

### GET /api/admin/export

Export analytics data as CSV.

**Query Parameters:**
- `days` (optional, default: 30)

**Headers:**
```
Authorization: Bearer {admin-token}
```

**Response:**
- Content-Type: `text/csv`
- File download with analytics data

**Example:**
```bash
curl http://localhost:3001/api/admin/export?days=30 \
  -H "Authorization: Bearer admin-authenticated" \
  -o analytics.csv
```

---

## Health Check

### GET /api/health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "service": "DISCERN API",
  "version": "1.0.0"
}
```

**Example:**
```bash
curl http://localhost:3001/api/health
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common Error Codes:**

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server issue |

---

## Rate Limiting

**Limits:**
- 50 requests per hour per IP address
- 200 requests per day per IP address

**Rate Limit Headers:**
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1710504600
```

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
```

---

## Caching

Analysis results are cached for 1 hour based on content hash.

**Cache Headers:**
```json
{
  "cached": true
}
```

Cached results are returned instantly without re-analyzing.

---

## Content Type Support

### URL Analysis

Supported domains:
- News sites (HTTP/HTTPS)
- Academic journals
- Blog posts
- Social media posts (where accessible)

Not supported:
- Password-protected sites
- Chrome internal pages
- Sites blocking bots

### PDF Analysis

- Max size: 10 MB
- Supported formats: PDF 1.0-1.7
- Text extraction preserves structure

### Text Analysis

- Max length: 50,000 characters
- Plain text or minimal HTML
- Automatically sanitized

---

## Best Practices

1. **Use Demo Mode for Testing**
   - Instant results
   - No API costs
   - Predictable data

2. **Enable Explainability Selectively**
   - Adds processing time
   - Useful for presentations
   - Includes step-by-step breakdown

3. **Handle Errors Gracefully**
   - Always check `success` field
   - Display user-friendly messages
   - Log errors for debugging

4. **Respect Rate Limits**
   - Implement client-side throttling
   - Cache results when possible
   - Use batch processing for multiple analyses

5. **Validate Input**
   - Check URL format before sending
   - Verify PDF size client-side
   - Sanitize text input

---

## Code Examples

### JavaScript (Fetch)

```javascript
async function analyzeContent(url) {
  const response = await fetch('http://localhost:3001/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'url',
      content: url,
    }),
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error)
  }

  return data.data
}

// Usage
const result = await analyzeContent('https://example.com/article')
console.log('Score:', result.score)
```

### Python (Requests)

```python
import requests

def analyze_content(url):
    response = requests.post(
        'http://localhost:3001/api/analyze',
        json={
            'type': 'url',
            'content': url
        }
    )

    data = response.json()

    if not data['success']:
        raise Exception(data['error'])

    return data['data']

# Usage
result = analyze_content('https://example.com/article')
print(f"Score: {result['score']}")
```

### cURL

```bash
#!/bin/bash

URL="https://example.com/article"

curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"url\",\"content\":\"$URL\"}" \
  | jq '.data.score'
```

---

## Webhooks (Future)

Coming soon:
- Real-time analysis updates
- Batch analysis callbacks
- Custom integrations

---

## Support

For API issues or questions:
- Check logs: `railway logs` or `vercel logs`
- Review error messages
- Test with `/api/health` first
- Verify environment variables

---

**Last Updated:** 2024-03-15
**API Version:** 1.0.0
