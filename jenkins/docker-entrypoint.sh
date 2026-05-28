#!/bin/bash
# Fix docker socket permissions so jenkins user can access it
chmod 666 /var/run/docker.sock 2>/dev/null || true

# Start Jenkins normally
exec /usr/bin/tini -- /usr/local/bin/jenkins.sh "$@"
