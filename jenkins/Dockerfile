FROM jenkins/jenkins:lts

USER root

# Install Docker CLI + docker compose plugin
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg lsb-release maven nodejs npm && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
      > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli docker-compose-plugin && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add jenkins user to docker group (GID 0 = root on Docker Desktop Windows)
RUN groupadd -f docker && usermod -aG docker jenkins && usermod -aG root jenkins

# Fix docker socket permissions on startup
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER jenkins
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
