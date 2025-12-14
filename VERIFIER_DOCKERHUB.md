# Guide : Comment Vérifier les Images sur DockerHub

Ce guide vous explique comment vérifier que vos images Docker ont été poussées avec succès sur DockerHub après l'exécution du pipeline Jenkins.

## 📋 Images à Vérifier

Votre pipeline Jenkins pousse les images suivantes :
1. `amounatahfouna/student-management:latest`
2. `amounatahfouna/student-management:1.0.0`
3. `amounatahfouna/student-management-frontend:latest`

## 🔍 Méthode 1 : Vérification via l'Interface Web DockerHub

### Étape 1 : Se connecter à DockerHub

1. Ouvrez votre navigateur et allez sur : **https://hub.docker.com**
2. Cliquez sur **Sign In** (en haut à droite)
3. Connectez-vous avec vos identifiants :
   - **Username** : `amounatahfouna`
   - **Password** : `Mayna123*`

### Étape 2 : Accéder à vos repositories

1. Une fois connecté, cliquez sur votre **username** (en haut à droite)
2. Sélectionnez **"My Profile"** ou **"Repositories"**
3. Vous verrez la liste de tous vos repositories

### Étape 3 : Vérifier le repository `student-management`

1. Cliquez sur le repository **`student-management`**
2. Vous devriez voir :
   - **Tags disponibles** : `latest` et `1.0.0`
   - **Date de dernière mise à jour** (Last pushed)
   - **Taille du repository** (Repository size)
   - **Nombre de pulls**

### Étape 4 : Vérifier le repository `student-management-frontend`

1. Retournez à la liste des repositories
2. Cliquez sur **`student-management-frontend`**
3. Vérifiez que le tag `latest` est présent

### ✅ Indicateurs de Succès

- ✅ Les repositories apparaissent dans votre liste
- ✅ Les tags (`latest`, `1.0.0`) sont visibles
- ✅ La date "Last pushed" correspond à aujourd'hui ou récente
- ✅ La taille du repository n'est pas 0 MB

## 🔍 Méthode 2 : Vérification via la Ligne de Commande

### Étape 1 : Se connecter à DockerHub via CLI

```bash
docker login -u amounatahfouna
# Entrez le mot de passe : Mayna123*
```

### Étape 2 : Vérifier les images localement

```bash
# Voir toutes les images locales avec le tag amounatahfouna
docker images | grep amounatahfouna
```

Vous devriez voir :
```
amounatahfouna/student-management          latest    <image-id>   <time-ago>   <size>
amounatahfouna/student-management          1.0.0     <image-id>   <time-ago>   <size>
amounatahfouna/student-management-frontend latest    <image-id>   <time-ago>   <size>
```

### Étape 3 : Vérifier via l'API DockerHub (optionnel)

```bash
# Vérifier les tags du repository student-management
curl -s https://hub.docker.com/v2/repositories/amounatahfouna/student-management/tags/ | grep -o '"name":"[^"]*"' | head -5

# Vérifier les tags du repository frontend
curl -s https://hub.docker.com/v2/repositories/amounatahfouna/student-management-frontend/tags/ | grep -o '"name":"[^"]*"' | head -5
```

## 🔍 Méthode 3 : Vérification dans Jenkins

### Étape 1 : Vérifier les logs du pipeline

1. Dans Jenkins, allez sur votre **job/pipeline**
2. Cliquez sur le **build** le plus récent
3. Ouvrez les logs du stage **"DOCKER-PUSH"**
4. Vous devriez voir des messages comme :
   ```
   The push refers to repository [docker.io/amounatahfouna/student-management]
   latest: digest: sha256:xxxxx size: xxxx
   ```

### Étape 2 : Vérifier que le stage a réussi

- ✅ Le stage **"DOCKER-PUSH"** doit être **vert** (succès)
- ✅ Aucune erreur dans les logs
- ✅ Messages de type "Pushed" ou "digest: sha256:..."

## 🐛 Résolution de Problèmes

### Problème 1 : Les images n'apparaissent pas sur DockerHub

**Causes possibles :**
1. Le pipeline n'a pas été exécuté jusqu'au stage DOCKER-PUSH
2. Les credentials DockerHub sont incorrects dans Jenkins
3. Erreur de connexion à DockerHub

**Solutions :**
1. Vérifiez les logs Jenkins du stage DOCKER-PUSH
2. Vérifiez les credentials dans Jenkins :
   - Allez dans **Manage Jenkins** → **Credentials**
   - Vérifiez que `dockerhub-credentials` existe et est correct
3. Testez la connexion manuellement :
   ```bash
   docker login -u amounatahfouna
   docker push amounatahfouna/student-management:latest
   ```

### Problème 2 : Erreur "unauthorized" ou "authentication required"

**Solution :**
1. Vérifiez que les credentials dans Jenkins sont corrects
2. Vérifiez que le mot de passe DockerHub est correct
3. Si vous utilisez un **Personal Access Token** (recommandé), assurez-vous qu'il a les permissions de **write**

### Problème 3 : Erreur "repository does not exist"

**Solution :**
1. Créez le repository sur DockerHub manuellement :
   - Allez sur https://hub.docker.com
   - Cliquez sur **"Create Repository"**
   - Nom : `student-management`
   - Visibilité : Public ou Private (selon votre choix)
2. Répétez pour `student-management-frontend`

### Problème 4 : Les images sont poussées mais ne sont pas visibles

**Solution :**
1. Attendez quelques minutes (synchronisation DockerHub)
2. Rafraîchissez la page DockerHub (F5)
3. Vérifiez que vous êtes connecté avec le bon compte

## ✅ Checklist de Vérification Complète

- [ ] Pipeline Jenkins exécuté avec succès
- [ ] Stage DOCKER-PUSH terminé sans erreur
- [ ] Connexion à DockerHub réussie
- [ ] Repository `student-management` visible sur DockerHub
- [ ] Tags `latest` et `1.0.0` présents pour `student-management`
- [ ] Repository `student-management-frontend` visible sur DockerHub
- [ ] Tag `latest` présent pour `student-management-frontend`
- [ ] Date "Last pushed" récente
- [ ] Taille des repositories > 0 MB

## 📸 Capture d'Écran Attendue

Sur DockerHub, vous devriez voir quelque chose comme :

```
Repository: amounatahfouna/student-management
Last pushed: X days ago
Repository size: XXX MB
Stars: 0
Pulls: X

Tags:
- 1.0.0 (Linux, Image, Pushed X days ago)
- latest (Linux, Image, Pushed X days ago)
```

## 🔗 Liens Utiles

- DockerHub : https://hub.docker.com
- Votre profil : https://hub.docker.com/u/amounatahfouna
- Repository backend : https://hub.docker.com/r/amounatahfouna/student-management
- Repository frontend : https://hub.docker.com/r/amounatahfouna/student-management-frontend

## 💡 Astuce : Utiliser un Personal Access Token (Recommandé)

Pour plus de sécurité, utilisez un **Personal Access Token** au lieu du mot de passe :

1. Allez sur DockerHub → **Account Settings** → **Security**
2. Cliquez sur **"New Access Token"**
3. Donnez un nom (ex: "Jenkins")
4. Copiez le token généré
5. Utilisez ce token comme mot de passe dans Jenkins

