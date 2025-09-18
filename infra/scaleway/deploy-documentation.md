#### Infrastructure

- [Cluster Kubernetes](https://console.scaleway.com/kubernetes/fr-par/clusters/dee77f50-e685-434e-9068-0e9c94de068a/overview)
- [Database](https://console.scaleway.com/rdb/fr-par/instances/4e63a034-a0d4-4749-a229-e844ba863ad0/overview)
- Login to registry : docker login rg.fr-par.scw.cloud/legipilot-production -u nologin --password-stdin <<< "$SCW_SECRET_KEY"     ([$SCW_SECRET_KEY ici, copier la clé secrète](https://atrian126-my.sharepoint.com/:i:/g/personal/marin_desurirey_atrian_fr/EfoMat1QJdxDu2_-gtNQXR8BzBkISTnlNoeA1_mQcOd9Xw?e=cdbtgO))

### Deploy a new version

Update pom.xml and package.json to allign versions with updated code (chore, feat, fix, ...). Use this version to tag docker images (legipilot-service:VERSION, legipilot-webapp:VERSION).

**Service**:

```bash
docker build --platform=linux/amd64 -t legipilot-service ./service
docker tag legipilot-service rg.fr-par.scw.cloud/legipilot-production/legipilot-service:1.0.3
docker push rg.fr-par.scw.cloud/legipilot-production/legipilot-service:1.0.3
```

**Front**:

```bash
docker build --platform=linux/amd64 -t legipilot-webapp ./web-app
docker tag legipilot-webapp rg.fr-par.scw.cloud/legipilot-production/legipilot-webapp:1.0.4
docker push rg.fr-par.scw.cloud/legipilot-production/legipilot-webapp:1.0.4
```

Modify the `deployment.yaml` files in `./infra/k8s/base` to use the new version.

**Deploy**:

```bash
kubectl apply -k ./infra/k8s/prod
```

### Useful commands

 - Exposition sur le monde exterieur : `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.2/deploy/static/provider/cloud/deploy.yaml`
 - 