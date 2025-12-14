pipeline {
    agent any

    tools {
        maven "M2_HOME"
    }

    environment {
        SONARQUBE_SCANNER = 'SonarQubeScanner' // Nom du scanner défini dans Jenkins
        SONARQUBE_SERVER = 'SonarQubeServer'   // Nom du serveur SonarQube défini dans Jenkins
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
    }

    stages {
        stage('GIT') {
            steps {
                git branch: 'main',
                url: 'https://github.com/redfox4ever/devops-student-management.git',
                credentialsId: 'jenkins-example-github-pat'
            }
        }

        stage('MVN CLEAN'){
            steps {
                 sh "mvn clean"
            }
        }

        stage('MVN COMPILE'){
            steps {
                 sh "mvn compile"
            }
        }

        stage('TEST'){
            steps {
                 // Run tests and generate JaCoCo report in one command
                 sh "mvn test jacoco:report"
                 // Archive test results
                 junit 'target/surefire-reports/*.xml'
            }
        }

        stage('PACKAGE'){
            steps {
               // Package without running tests again (skip tests since we already ran them)
               sh "mvn package -DskipTests"
            }
        }

        stage('QUALITY CHECK') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_AUTH_TOKEN')]) {
                    sh """
                        mvn sonar:sonar \
                        -Dsonar.projectKey=student-management \
                        -Dsonar.host.url=http://192.168.49.2:31000/ \
                        -Dsonar.login=$SONAR_AUTH_TOKEN \
                        -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml \
                        -Dsonar.java.coveragePlugin=jacoco \
                        -Dsonar.coverage.exclusions=**/entities/**,**/repositories/**,**/config/**,**/StudentManagementApplication.java
                    """
                }
            }
        }

        stage('DOCKER-BUILD') {
            steps {
                // Build backend image
                sh "docker build -t student-management-app ."
                sh "docker tag student-management-app:latest amounatahfouna/student-management:latest"
                sh "docker tag student-management-app:latest amounatahfouna/student-management:1.0.0"
                
                // Build frontend image
                sh "docker build -t student-management-frontend ./frontend"
                sh "docker tag student-management-frontend:latest amounatahfouna/student-management-frontend:latest"
            }
        }

        stage('DOCKER-PUSH') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push amounatahfouna/student-management:latest"
                    sh "docker push amounatahfouna/student-management:1.0.0"
                    sh "docker push amounatahfouna/student-management-frontend:latest"
                }
            }
        }

        stage('KUBERNETES-DEPLOYMENT') {
            steps {
                // Deploy MySQL
                sh "kubectl apply -f mysql-deployment.yaml --namespace=devops"
                sh "kubectl wait --for=condition=Available deployment/mysql --timeout=300s -n devops"

                // Deploy Spring Boot backend
                sh "kubectl apply -f spring-deployment.yaml --namespace=devops"
                
                // Deploy Angular frontend
                sh "kubectl apply -f frontend-deployment.yaml --namespace=devops"
            }
        }
        stage('MONITORING-DEPLOYMENT') {
            steps {

                sh "kubectl apply -f monitoring.yaml -n devops"
                sh "kubectl rollout restart deployment monitoring -n devops"
            }

        }
    }
}
