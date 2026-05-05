pipeline {
    agent any

    environment {
        EC2_IP = "15.206.179.251"
        DOCKERHUB_USER = "soham170905"
        IMAGE_NAME = "cartlabs"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/harshil59-bit/E-commerce.git'
            }
        }

        stage('Build Images') {
            steps {
                sh """
                docker build --no-cache -t ${DOCKERHUB_USER}/${IMAGE_NAME}-backend:latest ./backend
                docker build --no-cache -t ${DOCKERHUB_USER}/${IMAGE_NAME}-frontend:latest ./frontend
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push ${DOCKERHUB_USER}/${IMAGE_NAME}-backend:latest
                    docker push ${DOCKERHUB_USER}/${IMAGE_NAME}-frontend:latest
                    docker logout
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} "
                    cd E-commerce &&
                    docker compose pull &&
                    docker compose up -d
                    "
                    """
                }
            }
        }
    }
}