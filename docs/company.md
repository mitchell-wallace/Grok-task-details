task: "Research recent AI-related product and capability updates from {{var}}."
time_window:
  days: 14
  enforcement: "Hard cutoff. Only include items published within the last 14 days."
  rule: "If an item is older than 14 days, exclude it even if it is important."
  guidance: "Compute the earliest allowed date from 'today' and discard anything earlier."
focus:
  include:
    - "New or updated AI models and features (chat, coding, image, video)."
    - "Agents, APIs, app features, developer tools."
    - "Releases, previews, and notable technical improvements."
sources:
  prioritize:
    - "Primary sources from {{var}}: official blog posts, docs, release notes, GitHub, press releases, official X accounts."
  fallback:
    - "Reputable reporting only when primary sources are not available."
exclusions:
  - "Purely business news unrelated to AI capabilities (funding rounds, general partnerships without product details, executive moves)."
  - "Items outside the 14-day window."
sentiment:
  requirement: "Include community sentiment on releases within the same 14-day window."
  sources:
    - "Community posts on X (supplementary)."
output:
  format: "Summarize key updates with enough detail that an engineer can understand what changed and why it matters."
  fallback: "If no items meet the filters, return the most relevant available news, prioritizing recency and technology-related coverage."
