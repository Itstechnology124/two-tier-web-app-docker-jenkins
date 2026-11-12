pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Check Docker') {
            steps {
                sh 'docker version'
                sh 'docker compose version'
            }
        }

        stage('Check Project Files') {
            steps {
                sh '''
                    test -f backend/Dockerfile
                    test -f frontend/Dockerfile
                    test -f docker-compose.yml
                    test -f database/init.sql
                    echo "All required project files are present."
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t taskmanager-backend:${BUILD_NUMBER} ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t taskmanager-frontend:${BUILD_NUMBER} ./frontend'
            }
        }

        stage('Verify Docker Images') {
            steps {
                sh 'docker images'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Both Docker images were built successfully.'
        }

        failure {
            echo 'FAILED: Check the Jenkins console output for the error.'
        }
    }
}