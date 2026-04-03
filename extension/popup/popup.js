const API_URL = 'http://localhost:3001'

const app = document.getElementById('app')
const analyzeBtn = document.getElementById('analyzeBtn')

// State
let currentUrl = ''

// Initialize
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  currentUrl = tabs[0].url
})

analyzeBtn.addEventListener('click', analyzePage)

async function analyzePage() {
  try {
    showLoading()

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab.url || tab.url.startsWith('chrome://')) {
      showError('Cannot analyze Chrome internal pages')
      return
    }

    // Analyze URL
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'url',
        content: tab.url,
        demoMode: false,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Analysis failed')
    }

    showResult(data.data)

    // Send message to content script to show badge
    chrome.tabs.sendMessage(tab.id, {
      action: 'showBadge',
      score: data.data.score,
    })
  } catch (error) {
    showError(error.message)
  }
}

function showLoading() {
  app.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Analyzing page credibility...</p>
    </div>
  `
}

function showResult(result) {
  const scoreClass = getScoreClass(result.score)

  app.innerHTML = `
    <div class="result">
      <div class="score-display">
        <div class="score-value ${scoreClass}">${result.score}</div>
        <div class="score-label">Credibility Score</div>
      </div>

      <div class="summary">
        <h3>Summary</h3>
        <p>${result.summary}</p>
      </div>

      <div class="factors">
        <h3 style="margin-bottom: 12px; font-size: 14px; color: #111827;">Scoring Factors</h3>
        ${renderFactor('Bias', result.factors.bias, 25)}
        ${renderFactor('Source Rep.', result.factors.source_reputation, 25)}
        ${renderFactor('Evidence', result.factors.evidence, 25)}
        ${renderFactor('Logic', result.factors.logic, 25)}
      </div>

      <div class="actions">
        <button class="btn btn-primary" id="viewFullBtn">View Full Report</button>
        <button class="btn btn-secondary" id="retryBtn">Retry</button>
      </div>
    </div>
  `

  document.getElementById('viewFullBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: `http://localhost:3000/analyze?url=${encodeURIComponent(currentUrl)}` })
  })

  document.getElementById('retryBtn').addEventListener('click', () => {
    app.innerHTML = `
      <div class="container">
        <button id="analyzeBtn" class="analyze-button">
          Analyze This Page
        </button>
      </div>
    `
    document.getElementById('analyzeBtn').addEventListener('click', analyzePage)
  })
}

function renderFactor(name, value, max) {
  const percentage = (value / max) * 100
  const factorClass = percentage >= 80 ? 'factor-high' : percentage >= 50 ? 'factor-medium' : 'factor-low'

  return `
    <div class="factor">
      <div class="factor-header">
        <span class="factor-name">${name}</span>
        <span class="factor-value">${value}/${max}</span>
      </div>
      <div class="factor-bar">
        <div class="factor-fill ${factorClass}" style="width: ${percentage}%"></div>
      </div>
    </div>
  `
}

function showError(message) {
  app.innerHTML = `
    <div class="error">
      <div class="error-icon">⚠️</div>
      <p class="error-message">${message}</p>
      <button class="btn btn-primary" id="retryBtn">Try Again</button>
    </div>
  `

  document.getElementById('retryBtn').addEventListener('click', () => {
    app.innerHTML = `
      <div class="container">
        <button id="analyzeBtn" class="analyze-button">
          Analyze This Page
        </button>
      </div>
    `
    document.getElementById('analyzeBtn').addEventListener('click', analyzePage)
  })
}

function getScoreClass(score) {
  if (score >= 80) return 'score-high'
  if (score >= 50) return 'score-medium'
  return 'score-low'
}
