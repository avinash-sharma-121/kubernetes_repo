apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  namespace: nginx
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80 
  tolerations:
    - key: "prod"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
