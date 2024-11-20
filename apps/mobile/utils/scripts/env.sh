# Pull the latest changes from the git repository
git pull --rebase=false || { echo -e "${RED}git pull failed.${RESET}"; exit 1; }

# Install root dependencies
bun install || { echo -e "${RED}bun install failed.${RESET}"; exit 1; }

# Pull latest cloud variables.
npx dotenv-vault pull "$APP_ENVIRONMENT" .env

echo -e "${GREEN}Successfully pulled environment variables from environment vault for ${APP_ENVIRONMENT}${RESET}"

# Check if .env file exists in the root directory
if [ -f .env ]; then
    echo -e "${GREEN}.env file exists in the root directory.${RESET}"
else
    echo -e "${RED}.env file does not exist in the root directory.${RESET}"
    exit 1
fi
