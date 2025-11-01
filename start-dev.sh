#!/bin/bash
set -a # automatically export all variables
source .env.local
set +a
pnpm next dev
