# Guide de Configuration DevOps - Student Management

Ce guide explique comment configurer l'intégration complète de DockerHub, SonarQube, Kubernetes et Prometheus/Grafana pour le projet Student Management.

## 📋 Prérequis

- WSL2 avec Ubuntu installé
- Docker installé et configuré
- Jenkins installé et accessible
- SonarQube installé et accessible
- Kubernetes (Minikube) installé et configuré
- Node Exporter installé sur la machine Ubuntu (pour les métriques système)

## 1️⃣ Configuration DockerHub

### Étape 1: Vérifier l'image sur DockerHub

L'image Docker est configurée pour être poussée vers votre repository DockerHub :
- **Repository**: `amounatahfouna/student-management`
- **Tag**: `latest` et `1.0.0`

### Étape 2: Configurer les credentials dans Jenkins

1. Allez dans Jenkins → **Manage Jenkins** → **Credentials**
2. Ajoutez une nouvelle credential de type **Username with password**:
   - **ID**: `dockerhub-credentials`
   - **Username**: `amounatahfouna`
   - **Password**: `Mayna123*`

### Étape 3: Vérifier le push

Le pipeline Jenkins pousse automatiquement les images après le build. Vérifiez sur DockerHub que les images sont bien présentes.

## 2️⃣ Configuration SonarQube avec Jenkins

### Étape 1: Installer le plugin SonarQube dans Jenkins

1. Allez dans **Manage Jenkins** → **Plugins**
2. Installez le plugin **SonarQube Scanner**

### Étape 2: Configurer SonarQube Server dans Jenkins

1. Allez dans **Manage Jenkins** → **Configure System**
2. Dans la section **SonarQube servers**, ajoutez:
   - **Name**: `SonarQubeServer`
   - **Server URL**: `http://192.168.49.2:31000/` (ou votre URL SonarQube)
   - **Server authentication token**: Créez un token dans SonarQube et ajoutez-le comme credential

### Étape 3: Créer un token SonarQube

1. Connectez-vous à SonarQube (admin/Mayna123*)
2. Allez dans **My Account** → **Security**
3. Créez un nouveau token (ex: `jenkins-token`)
4. Copiez le token

### Étape 4: Ajouter le token dans Jenkins

1. Dans Jenkins → **Manage Jenkins** → **Credentials**
2. Ajoutez une credential de type **Secret text**:
   - **ID**: `sonar-token`
   - **Secret**: Collez le token SonarQube

### Étape 5: Vérifier le Coverage

Le pipeline Jenkins exécute automatiquement:
- Les tests avec JaCoCo
- L'analyse SonarQube avec le rapport de coverage

Le coverage devrait maintenant être visible dans SonarQube (pas à zéro).

**Note**: Assurez-vous que:
- Les tests sont exécutés avant l'analyse SonarQube
- Le rapport JaCoCo est généré dans `target/site/jacoco/jacoco.xml`
- Le plugin JaCoCo est bien configuré dans `pom.xml`

## 3️⃣ Configuration Kubernetes

### Étape 1: Créer le namespace

```bash
kubectl create namespace devops
```

### Étape 2: Déployer MySQL

```bash
kubectl apply -f mysql-deployment.yaml --namespace=devops
kubectl wait --for=condition=Available deployment/mysql --timeout=300s -n devops
```

### Étape 3: Déployer l'application Spring Boot

```bash
kubectl apply -f spring-deployment.yaml --namespace=devops
```

### Étape 4: Déployer le frontend

```bash
kubectl apply -f frontend-deployment.yaml --namespace=devops
```

### Étape 5: Vérifier les déploiements

```bash
kubectl get pods -n devops
kubectl get services -n devops
```

### Étape 6: Accéder à l'application

```bash
minikube service spring-service -n devops --url
```

L'application devrait être accessible sur le port NodePort (30080 par défaut).

## 4️⃣ Configuration Prometheus et Grafana

### Étape 1: Installer Node Exporter sur Ubuntu

Pour collecter les métriques système de la machine Ubuntu:

```bash
# Télécharger Node Exporter
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
cd node_exporter-1.6.1.linux-amd64

# Lancer Node Exporter
sudo ./node_exporter --web.listen-address=":9100"
```

Pour le lancer en service systemd:

```bash
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
```

### Étape 2: Installer le plugin Prometheus dans Jenkins

1. Dans Jenkins → **Manage Jenkins** → **Plugins**
2. Installez le plugin **Prometheus metrics**
3. Le plugin expose les métriques sur `/prometheus`

### Étape 3: Vérifier Spring Actuator

L'application Spring Boot expose déjà les métriques Prometheus sur:
- `/student/actuator/prometheus`

Vérifiez que l'endpoint est accessible:
```bash
curl http://<minikube-ip>:30080/student/actuator/prometheus
```

### Étape 4: Déployer Prometheus et Grafana

```bash
kubectl apply -f monitoring.yaml -n devops
```

### Étape 5: Vérifier les services

```bash
kubectl get pods -n devops | grep monitoring
kubectl get services -n devops | grep -E "prometheus|grafana"
```

### Étape 6: Accéder à Prometheus

```bash
minikube service prometheus-service -n devops --url
```

Prometheus devrait être accessible sur le port 30900.

### Étape 7: Accéder à Grafana

```bash
minikube service grafana-service -n devops --url
```

Grafana devrait être accessible sur le port 30700.

**Credentials par défaut**:
- Username: `admin`
- Password: `admin`

### Étape 8: Vérifier le Dashboard

Le dashboard "DevOps Student Management - Monitoring Dashboard" devrait être automatiquement chargé dans Grafana.

Si ce n'est pas le cas:
1. Allez dans **Dashboards** → **Browse**
2. Le dashboard devrait apparaître dans la liste

## 5️⃣ Vérification des Métriques

### Métriques Spring Boot (via Actuator)

Les métriques suivantes sont collectées:
- HTTP requests rate
- JVM memory usage
- Active threads
- Response time (p95)
- Error rate (4xx, 5xx)

### Métriques Ubuntu (via Node Exporter)

Les métriques suivantes sont collectées:
- CPU usage
- Memory usage
- Disk usage
- Network I/O

### Métriques Jenkins (via Prometheus Plugin)

Les métriques suivantes sont collectées:
- Build status (success/failure)
- Build duration
- Job execution metrics

## 6️⃣ Résolution de Problèmes

### Coverage SonarQube à zéro

1. Vérifiez que les tests sont exécutés:
   ```bash
   mvn clean test
   ```

2. Vérifiez que le rapport JaCoCo est généré:
   ```bash
   ls -la target/site/jacoco/jacoco.xml
   ```

3. Vérifiez la configuration SonarQube dans le Jenkinsfile

### Prometheus ne collecte pas les métriques

1. Vérifiez que les services sont accessibles:
   ```bash
   kubectl get endpoints -n devops
   ```

2. Vérifiez la configuration Prometheus:
   ```bash
   kubectl get configmap prometheus-config -n devops -o yaml
   ```

3. Vérifiez les logs Prometheus:
   ```bash
   kubectl logs -n devops deployment/monitoring -c prometheus
   ```

### Grafana ne charge pas le dashboard

1. Vérifiez les logs Grafana:
   ```bash
   kubectl logs -n devops deployment/monitoring -c grafana
   ```

2. Vérifiez que les ConfigMaps sont bien montés:
   ```bash
   kubectl describe pod -n devops -l app=monitoring
   ```

## 7️⃣ Commandes Utiles

### Kubernetes

```bash
# Voir tous les pods
kubectl get pods -n devops

# Voir les logs d'un pod
kubectl logs -n devops <pod-name>

# Redémarrer un déploiement
kubectl rollout restart deployment/<deployment-name> -n devops

# Supprimer un déploiement
kubectl delete deployment/<deployment-name> -n devops
```

### Docker

```bash
# Build l'image
docker build -t amounatahfouna/student-management:latest .

# Push l'image
docker push amounatahfouna/student-management:latest

# Vérifier les images locales
docker images | grep student-management
```

### Jenkins

```bash
# Lancer un build manuellement
# Via l'interface web Jenkins
```

## 📝 Notes Importantes

1. **IP Addresses**: Les adresses IP dans les fichiers de configuration (192.168.49.2, 192.168.49.1) doivent être adaptées à votre environnement.

2. **Ports**: Vérifiez que les ports NodePort ne sont pas déjà utilisés.

3. **Credentials**: Ne commitez jamais les credentials dans le code. Utilisez toujours les credentials Jenkins.

4. **Coverage**: Pour améliorer le coverage, ajoutez plus de tests unitaires dans le projet.

5. **Monitoring**: Assurez-vous que Node Exporter et le plugin Prometheus Jenkins sont bien installés et fonctionnels.

## ✅ Checklist de Vérification

- [ ] Image DockerHub poussée avec succès
- [ ] SonarQube intégré avec Jenkins
- [ ] Coverage visible dans SonarQube (pas à zéro)
- [ ] Application déployée sur Kubernetes
- [ ] Prometheus collecte les métriques Spring Boot
- [ ] Prometheus collecte les métriques Ubuntu (Node Exporter)
- [ ] Prometheus collecte les métriques Jenkins
- [ ] Grafana accessible et dashboard chargé
- [ ] Toutes les métriques visibles dans le dashboard

