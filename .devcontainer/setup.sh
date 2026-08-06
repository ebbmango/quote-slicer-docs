#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${FONTAWESOME_TOKEN:-}" ]]; then
	echo "Error: FONTAWESOME_TOKEN is not set." >&2
	echo "Add it as a Codespaces secret scoped to ebbmango/quote-slicer-docs, then rebuild the container." >&2
	exit 1
fi

umask 077
{
	printf '%s\n' '@awesome.me:registry=https://npm.fontawesome.com/'
	printf '%s\n' '@fortawesome:registry=https://npm.fontawesome.com/'
	printf '%s\n' "//npm.fontawesome.com/:_authToken=${FONTAWESOME_TOKEN}"
	printf '%s\n' 'always-auth=true'
} > .npmrc

echo "Configured the ignored project .npmrc for Font Awesome packages."
npm ci
