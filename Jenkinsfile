pipeline {
    agent any
    environment {
        DOCKER_PATH = "C:\\Program Files\\Docker\\cli-plugins"
        PATH = "${DOCKER_PATH}:${PATH}"
        NODEJS_PATH = "C:\\Program Files\\nodejs"
    }
    stages {
        stage('Install Node.js and npm') {
            steps {
                script {
                    def nodejs = tool name: 'NODEJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodejs}/bin:${env.PATH}"
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube Test') {
                        bat 'npm run sonar'
                    }
                }
            }
        }
        
        stage('Build & Rename Docker Image') {
            steps {
                script {
                    bat "docker build -t utilisateur:latest ."
                    bat "docker tag utilisateur:latest faika/utilisateur:latest"
                }
            }
        }

        stage('Publish Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                        bat 'docker login -u %DOCKERHUB_USERNAME% -p %DOCKERHUB_PASSWORD%'
                        bat 'docker tag faika/utilisateur:latest faika/utilisateur:%BUILD_ID%'
                        bat 'docker push faika/utilisateur:%BUILD_ID%'
                        bat 'docker push faika/utilisateur:latest'
                    }
                }
            }
        }
        stage('kubernetes Deployment') {
            steps {
                script {
                   bat 'kubectl apply -f user-deployment.yaml'
                   bat 'kubectl apply -f user-service.yaml' 
                }
            }
        }
    }
    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
