-- Seed Demo Content for DISCERN

INSERT INTO "DemoContent" ("id", "title", "url", "category", "expectedScore", "cachedResult") VALUES
(
    'demo-001',
    'Climate Change: IPCC Sixth Assessment Report',
    'https://www.ipcc.ch/report/ar6/wg1/',
    'science',
    95,
    '{
        "score": 95,
        "confidence": "high",
        "summary": "This report from the Intergovernmental Panel on Climate Change (IPCC) demonstrates exceptional credibility. It represents a comprehensive synthesis of peer-reviewed climate science, authored by leading experts globally. The content is rigorously sourced, methodologically sound, and presents evidence-based conclusions with appropriate uncertainty quantification.",
        "citations": [
            {
                "claim": "Global surface temperature has increased by approximately 1.1°C since pre-industrial times",
                "source": "IPCC AR6 WG1 Report, Chapter 2",
                "reliability": "high",
                "supports": true,
                "excerpt": "Observed increases in global surface temperature since 1850-1900 are unequivocal"
            },
            {
                "claim": "Human activities are the dominant cause of observed warming",
                "source": "NASA Climate Change Evidence",
                "reliability": "high",
                "supports": true,
                "url": "https://climate.nasa.gov/evidence/"
            }
        ],
        "factors": {
            "bias": 3,
            "source_reputation": 25,
            "evidence": 25,
            "logic": 23
        },
        "warnings": []
    }'
),
(
    'demo-002',
    'Opinion: Climate Change is a Hoax Created by Scientists',
    'https://example.com/climate-denial-blog',
    'misinformation',
    12,
    '{
        "score": 12,
        "confidence": "high",
        "summary": "This content demonstrates extremely low credibility with multiple significant issues. The article employs highly emotional and biased language, lacks credible sources, contradicts overwhelming scientific consensus, and relies on logical fallacies. The source has no established reputation in climate science and presents cherry-picked data without proper context.",
        "citations": [
            {
                "claim": "97% of climate scientists agree on human-caused climate change",
                "source": "NASA Scientific Consensus",
                "reliability": "high",
                "supports": false,
                "excerpt": "Multiple studies show 97% or higher consensus among climate scientists"
            },
            {
                "claim": "Extreme weather events are becoming more frequent",
                "source": "NOAA Climate Extremes Index",
                "reliability": "high",
                "supports": false,
                "url": "https://www.noaa.gov/"
            }
        ],
        "factors": {
            "bias": 24,
            "source_reputation": 2,
            "evidence": 1,
            "logic": 3
        },
        "warnings": [
            "Content contradicts established scientific consensus",
            "Source lacks credible scientific credentials",
            "Heavy use of emotional and loaded language detected"
        ]
    }'
),
(
    'demo-003',
    'Reuters: Global Economic Outlook 2026',
    'https://www.reuters.com/markets/global-outlook',
    'news',
    87,
    '{
        "score": 87,
        "confidence": "high",
        "summary": "This Reuters article demonstrates strong journalistic credibility. The reporting is balanced, well-sourced with expert quotes and data, and maintains editorial standards. Reuters is a highly reputable international news agency known for fact-based reporting. The article presents multiple perspectives and clearly distinguishes between facts and analysis.",
        "citations": [
            {
                "claim": "Global GDP growth projected at 3.1% for 2026",
                "source": "International Monetary Fund World Economic Outlook",
                "reliability": "high",
                "supports": true,
                "excerpt": "IMF projects global growth at 3.1% for 2026"
            },
            {
                "claim": "Inflation rates stabilizing in major economies",
                "source": "OECD Economic Indicators",
                "reliability": "high",
                "supports": true,
                "url": "https://www.oecd.org/"
            }
        ],
        "factors": {
            "bias": 5,
            "source_reputation": 24,
            "evidence": 22,
            "logic": 23
        },
        "warnings": []
    }'
),
(
    'demo-004',
    'Miracle Cure: This One Weird Trick Cures All Diseases!',
    'https://example.com/miracle-cure-blog',
    'misinformation',
    8,
    '{
        "score": 8,
        "confidence": "high",
        "summary": "This content exhibits hallmarks of medical misinformation and lacks any scientific credibility. It makes extraordinary health claims without peer-reviewed evidence, uses manipulative marketing language, and could pose public health risks. The source has no medical credentials, provides no citations to legitimate research, and contradicts established medical science.",
        "citations": [
            {
                "claim": "No single treatment cures all diseases",
                "source": "Mayo Clinic Medical Guidelines",
                "reliability": "high",
                "supports": false,
                "excerpt": "Medical science recognizes that different diseases require specific, evidence-based treatments"
            },
            {
                "claim": "Unproven medical claims can be dangerous",
                "source": "FDA Consumer Health Information",
                "reliability": "high",
                "supports": false,
                "url": "https://www.fda.gov/"
            }
        ],
        "factors": {
            "bias": 25,
            "source_reputation": 0,
            "evidence": 0,
            "logic": 1
        },
        "warnings": [
            "DANGER: Medical misinformation detected",
            "Content makes health claims without scientific evidence",
            "Source lacks medical credentials or peer review",
            "Consult healthcare professionals before acting on health information"
        ]
    }'
),
(
    'demo-005',
    'Nature Journal: Breakthrough in Quantum Computing',
    'https://www.nature.com/articles/quantum-computing',
    'science',
    92,
    '{
        "score": 92,
        "confidence": "high",
        "summary": "This peer-reviewed article from Nature demonstrates excellent scientific credibility. Nature is one of the world''s most prestigious scientific journals with rigorous peer review processes. The article presents original research with detailed methodology, appropriate statistical analysis, and clear acknowledgment of limitations. Authors are established experts in the field.",
        "citations": [
            {
                "claim": "Quantum supremacy achieved with 127-qubit processor",
                "source": "IBM Quantum Research Publications",
                "reliability": "high",
                "supports": true,
                "excerpt": "Recent advances demonstrate quantum advantage in specific computational tasks"
            },
            {
                "claim": "Error correction remains a key challenge",
                "source": "MIT Technology Review - Quantum Computing",
                "reliability": "high",
                "supports": true,
                "url": "https://www.technologyreview.com/"
            }
        ],
        "factors": {
            "bias": 2,
            "source_reputation": 25,
            "evidence": 24,
            "logic": 24
        },
        "warnings": []
    }'
);
