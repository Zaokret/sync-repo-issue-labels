# Setup

0. Clone repository
1. Create github personal access token with repository issues read/write permission
2. Clone repository
3. Create `.env` file and append line `GITHUB_TOKEN=YOUR_PERSONAL_ACCESS_TOKEN`

# Run

It copies all non-default labels to from the source to the target repository.

`pnpm start "AUTHOR/SOURCE_REPO" "AUTHOR/TARGET_REPO"`
