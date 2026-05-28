// ============================================================
// Stress Relief & Mental Wellness - Jenkins Pipeline
// DevOps Timeline:
// Developer Push → GitHub Trigger → Jenkins Pipeline
// → Maven Build → Docker Image Build → Docker Compose Deploy
// → Application Running
// ============================================================

pipeline {
    agent any

    environment {
        JAVA_VERSION = '21'
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT?.take(7) ?: 'latest'}"
        // Use credentials if they exist, otherwise fall back to defaults
        JWT_SECRET = credentials('jwt-secret')
        MONGO_PASSWORD = credentials('mongo-password')
    }

    triggers {
        // Trigger on GitHub push via webhook
        githubPush()
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('📥 Checkout') {
            steps {
                echo '============================================'
                echo '📥 STAGE 1: Checking out source code...'
                echo '============================================'
                checkout scm
                sh 'echo "Branch: ${GIT_BRANCH}"'
                sh 'echo "Commit: ${GIT_COMMIT}"'
            }
        }

        stage('☕ Setup Java 21') {
            steps {
                echo '============================================'
                echo '☕ STAGE 2: Setting up Java 21...'
                echo '============================================'
                sh 'java -version'
                sh 'mvn -version'
            }
        }

        stage('🔨 Maven Build') {
            parallel {
                stage('Build user-service') {
                    steps {
                        echo 'Building user-service...'
                        dir('user-service') {
                            sh 'mvn clean package -DskipTests -B'
                        }
                    }
                }
                stage('Build activity-service') {
                    steps {
                        echo 'Building activity-service...'
                        dir('activity-service') {
                            sh 'mvn clean package -DskipTests -B'
                        }
                    }
                }
                stage('Build session-service') {
                    steps {
                        echo 'Building session-service...'
                        dir('session-service') {
                            sh 'mvn clean package -DskipTests -B'
                        }
                    }
                }
            }
        }

        stage('⚛️ Frontend Build') {
            steps {
                echo '============================================'
                echo '⚛️ STAGE 4: Building React Frontend...'
                echo '============================================'
                dir('frontend') {
                    sh 'npm ci'
                    sh 'CI=false npm run build'
                }
            }
        }

        stage('🐳 Docker Image Build') {
            steps {
                echo '============================================'
                echo '🐳 STAGE 5: Building Docker Images...'
                echo '============================================'
                echo 'Building custom Dockerfile images...'
                sh 'docker build -t wellness/user-service:${IMAGE_TAG} -t wellness/user-service:latest ./user-service'
                sh 'docker build -t wellness/activity-service:${IMAGE_TAG} -t wellness/activity-service:latest ./activity-service'
                sh 'docker build -t wellness/session-service:${IMAGE_TAG} -t wellness/session-service:latest ./session-service'

                echo 'Pulling DockerHub images...'
                sh 'docker pull mongo:7.0'
                sh 'docker pull nginx:alpine'

                echo 'Docker images ready:'
                sh 'docker images | grep -E "wellness|mongo|nginx"'
            }
        }

        stage('🚀 Docker Compose Deploy') {
            steps {
                echo '============================================'
                echo '🚀 STAGE 6: Deploying with Docker Compose...'
                echo '============================================'
                sh """
                    cat > .env <<'ENVEOF'
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=${MONGO_PASSWORD}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=86400000
CORS_ORIGINS=http://localhost:3000,http://localhost:80
ENVEOF
                """
                sh 'docker compose down --remove-orphans || true'
                sh 'docker compose up -d'
                echo 'Waiting for services to start...'
                sh 'sleep 60'
            }
        }

        stage('🏥 Health Checks') {
            steps {
                echo '============================================'
                echo '🏥 STAGE 7: Running Health Checks...'
                echo '============================================'
                sh '''
                    echo "Checking User Service..."
                    curl -f http://localhost:8081/api/users/health && echo "✅ User Service: UP"

                    echo "Checking Activity Service..."
                    curl -f http://localhost:8082/api/activities/health && echo "✅ Activity Service: UP"

                    echo "Checking Session Service..."
                    curl -f http://localhost:8083/api/sessions/health && echo "✅ Session Service: UP"

                    echo "Checking Nginx Gateway..."
                    curl -f http://localhost/health && echo "✅ Nginx Gateway: UP"
                '''
            }
        }
    }

    post {
        success {
            echo '''
============================================
🎉 PIPELINE SUCCESSFUL!
============================================
✅ Maven Build: PASSED
✅ Frontend Build: PASSED
✅ Docker Images Built: PASSED
✅ Docker Compose Deployed: PASSED
✅ Health Checks: PASSED

🌐 Application is running at:
  - Frontend:         http://localhost:80
  - User Service:     http://localhost:8081
  - Activity Service: http://localhost:8082
  - Session Service:  http://localhost:8083
  - MongoDB:          localhost:27017
============================================
            '''
        }
        failure {
            node('') {
                echo '❌ Pipeline FAILED! Check logs above.'
                sh 'docker compose logs --tail=50 || true'
            }
        }
        always {
            node('') {
                sh 'docker compose ps || true'
            }
        }
    }
}
