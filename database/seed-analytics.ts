import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const prisma = new PrismaClient();

// Sample domains with varying credibility
const domains = [
  { domain: 'nytimes.com', avgScore: 82, category: 'news' },
  { domain: 'washingtonpost.com', avgScore: 81, category: 'news' },
  { domain: 'reuters.com', avgScore: 88, category: 'news' },
  { domain: 'apnews.com', avgScore: 87, category: 'news' },
  { domain: 'bbc.com', avgScore: 85, category: 'news' },
  { domain: 'theguardian.com', avgScore: 79, category: 'news' },
  { domain: 'cnn.com', avgScore: 74, category: 'news' },
  { domain: 'foxnews.com', avgScore: 68, category: 'news' },
  { domain: 'nature.com', avgScore: 94, category: 'science' },
  { domain: 'science.org', avgScore: 93, category: 'science' },
  { domain: 'scientificamerican.com', avgScore: 86, category: 'science' },
  { domain: 'medium.com', avgScore: 62, category: 'opinion' },
  { domain: 'substack.com', avgScore: 65, category: 'opinion' },
  { domain: 'breitbart.com', avgScore: 45, category: 'partisan' },
  { domain: 'dailymail.co.uk', avgScore: 52, category: 'tabloid' },
  { domain: 'buzzfeed.com', avgScore: 58, category: 'entertainment' },
  { domain: 'infowars.com', avgScore: 28, category: 'conspiracy' },
  { domain: 'naturalnews.com', avgScore: 32, category: 'conspiracy' },
  { domain: 'theonion.com', avgScore: 15, category: 'satire' },
  { domain: 'axios.com', avgScore: 83, category: 'news' },
];

// Sample article titles
const headlines = [
  'Climate Change Impact on Global Agriculture Reaches Critical Point',
  'New Study Reveals Breakthrough in Cancer Treatment',
  'Economic Indicators Show Mixed Signals for Recovery',
  'Supreme Court Ruling Affects Healthcare Policy Nationwide',
  'Scientists Discover Potential Habitable Exoplanet',
  'Election Results Show Unexpected Shift in Voter Demographics',
  'Technology Giants Face Antitrust Investigation',
  'Renewable Energy Investment Hits Record High',
  'Education Reform Bill Passes Through Senate',
  'Public Health Officials Warn About Emerging Viral Threat',
  'Archaeological Discovery Rewrites Ancient History',
  'Space Mission Successfully Lands on Mars',
  'Immigration Policy Changes Impact Thousands',
  'Stock Market Volatility Continues Amid Global Uncertainty',
  'Artificial Intelligence Advances Raise Ethical Questions',
  'Infrastructure Plan Promises Major Investment',
  'Pharmaceutical Breakthrough Offers Hope for Rare Disease',
  'International Trade Agreement Signed',
  'Cybersecurity Breach Affects Major Corporation',
  'Environmental Regulations Face Legal Challenge',
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getScoreDistribution(baseScore: number): { bias: number; source_reputation: number; evidence: number; logic: number } {
  const variance = randomBetween(-5, 5);
  const total = baseScore + variance;

  // Distribute the score across 4 factors (each max 25)
  const factors = {
    bias: randomBetween(Math.max(0, total / 4 - 3), Math.min(25, total / 4 + 3)),
    source_reputation: randomBetween(Math.max(0, total / 4 - 3), Math.min(25, total / 4 + 3)),
    evidence: randomBetween(Math.max(0, total / 4 - 3), Math.min(25, total / 4 + 3)),
    logic: randomBetween(Math.max(0, total / 4 - 3), Math.min(25, total / 4 + 3)),
  };

  return factors;
}

function getConfidence(score: number): 'low' | 'medium' | 'high' {
  if (score >= 80 || score <= 30) return 'high';
  if (score >= 60 || score <= 40) return 'medium';
  return 'low';
}

function generateSummary(score: number, domain: string): string {
  if (score >= 80) {
    return `This article from ${domain} demonstrates high credibility with well-sourced claims, neutral language, and logical consistency. The content is backed by reputable sources and maintains journalistic standards.`;
  } else if (score >= 60) {
    return `This content from ${domain} shows moderate credibility with some verifiable claims, though it may include slight bias or limited sourcing. The information should be cross-referenced with additional sources.`;
  } else if (score >= 40) {
    return `This article from ${domain} exhibits questionable credibility with significant bias, emotional language, or weak sourcing. Many claims lack proper verification and should be viewed with skepticism.`;
  } else {
    return `This content from ${domain} demonstrates low credibility with strong bias, unverified claims, and poor sourcing. The information appears unreliable and potentially misleading.`;
  }
}

function generateCitations(score: number) {
  const numCitations = score >= 70 ? randomBetween(3, 5) : randomBetween(1, 3);
  const citations = [];

  for (let i = 0; i < numCitations; i++) {
    const reliability = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
    const supports = Math.random() > 0.2; // 80% support, 20% contradict

    citations.push({
      claim: `Key claim ${i + 1} from the article`,
      source: reliability === 'high' ? 'Reuters' : reliability === 'medium' ? 'News Outlet' : 'Blog Post',
      reliability,
      reliabilityReason: reliability === 'high' ? 'Established news agency with fact-checking standards' : 'Mixed credibility record',
      supports,
      supportsReason: supports ? 'Corroborates main points with similar findings' : 'Presents conflicting evidence',
      url: 'https://example.com/source',
    });
  }

  return citations;
}

function getRandomDate(): Date {
  // Create dates between April 2, 2026 and now (April 6, 2026)
  const startDate = new Date('2026-04-02T00:00:00');
  const endDate = new Date(); // Today

  const timeDiff = endDate.getTime() - startDate.getTime();
  const randomTime = Math.random() * timeDiff;

  return new Date(startDate.getTime() + randomTime);
}

async function seedAnalytics() {
  console.log('🌱 Starting to seed analytics data...\n');

  const recordsToCreate = 350; // Create 350 analysis records
  const createdRecords = [];

  for (let i = 0; i < recordsToCreate; i++) {
    // Random content type distribution: 70% URL, 20% text, 10% PDF
    const rand = Math.random();
    const contentType = rand < 0.7 ? 'url' : rand < 0.9 ? 'text' : 'pdf';

    // Pick random domain
    const domainInfo = domains[randomBetween(0, domains.length - 1)];
    const headline = headlines[randomBetween(0, headlines.length - 1)];

    // Score with some variance from domain average
    const score = Math.max(0, Math.min(100, domainInfo.avgScore + randomBetween(-15, 15)));
    const factors = getScoreDistribution(score);
    const confidence = getConfidence(score);

    // Generate unique content hash
    const contentHash = crypto.createHash('sha256').update(`${domainInfo.domain}-${headline}-${i}-${Date.now()}`).digest('hex');

    const originalContent = contentType === 'url'
      ? `https://${domainInfo.domain}/article/${Date.now()}-${i}`
      : `Title: ${headline}\n\nContent from ${domainInfo.domain}...`;

    const record = {
      contentType,
      contentHash,
      originalContent,
      score,
      confidence,
      summary: generateSummary(score, domainInfo.domain),
      citations: generateCitations(score),
      factors,
      warnings: score < 50 ? ['Low credibility content detected'] : [],
      demoMode: false,
      explainability: Math.random() > 0.8, // 20% with explainability
      processingTime: randomBetween(15000, 45000), // 15-45 seconds
      ipAddress: `192.168.${randomBetween(1, 255)}.${randomBetween(1, 255)}`,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      domain: contentType === 'url' ? domainInfo.domain : null,
      createdAt: getRandomDate(), // Spread between April 2 and today
    };

    try {
      const created = await prisma.analysis.create({ data: record });
      createdRecords.push(created);

      if ((i + 1) % 50 === 0) {
        console.log(`✓ Created ${i + 1}/${recordsToCreate} records...`);
      }
    } catch (error) {
      console.error(`Error creating record ${i + 1}:`, error);
    }
  }

  console.log(`\n✅ Successfully created ${createdRecords.length} analysis records!`);
  console.log('\n📊 Distribution:');

  const urlCount = createdRecords.filter(r => r.contentType === 'url').length;
  const textCount = createdRecords.filter(r => r.contentType === 'text').length;
  const pdfCount = createdRecords.filter(r => r.contentType === 'pdf').length;

  const highScore = createdRecords.filter(r => r.score >= 80).length;
  const mediumScore = createdRecords.filter(r => r.score >= 50 && r.score < 80).length;
  const lowScore = createdRecords.filter(r => r.score < 50).length;

  console.log(`  URLs: ${urlCount} (${Math.round(urlCount / createdRecords.length * 100)}%)`);
  console.log(`  Text: ${textCount} (${Math.round(textCount / createdRecords.length * 100)}%)`);
  console.log(`  PDFs: ${pdfCount} (${Math.round(pdfCount / createdRecords.length * 100)}%)`);
  console.log(`\n  High credibility (80-100): ${highScore}`);
  console.log(`  Medium credibility (50-79): ${mediumScore}`);
  console.log(`  Low credibility (0-49): ${lowScore}`);

  const avgScore = createdRecords.reduce((sum, r) => sum + r.score, 0) / createdRecords.length;
  console.log(`\n  Average score: ${avgScore.toFixed(1)}`);
}

seedAnalytics()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
