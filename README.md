# k8s-mongodb-tenant-operator

### Install Custom Resource Definitions
```sh
kubectl apply -f ./crds/
```


### Install Operator 
#TODO

### Create a mongoDB tenant / user

```yaml
apiVersion: mongotenantoperator.com/v1alpha1
kind: MongoDBUser
metadata:
  name: dev-team-1
  namespace: default
spec:
  dbName: my-awesome-db
  roles:
    - "dbAdmin"
```
