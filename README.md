Create RabbitMQ and Redis in Compose

```
cd containers/blockchain
export FABRIC_CFG_PATH=$(pwd)
export EVENT_NAME=''
./generate-certs.sh
```

```
export DOCKERHUB_USERNAME=''
export DOCKER_TAGS=''

docker build -t $DOCKERHUB_USERNAME/kubecon-blockchain-setup:$DOCKER_TAGS blockchainNetwork/
docker build -t $DOCKERHUB_USERNAME/kubecon-backend:$DOCKER_TAGS backend/
docker build -t $DOCKERHUB_USERNAME/kubecon-rabbitclient-api:$DOCKER_TAGS rabbitClient/

docker push $DOCKERHUB_USERNAME/kubecon-blockchain-setup:$DOCKER_TAGS
docker push $DOCKERHUB_USERNAME/kubecon-backend:$DOCKER_TAGS
docker push $DOCKERHUB_USERNAME/kubecon-rabbitclient-api:$DOCKER_TAGS
```

```
kubectl create secret generic channel-${EVENT_NAME} --from-file=channel.tx=configuration/channel.tx
kubectl create secret generic secret-config --from-file=config.json=configuration/config.json

```

```
kubectl apply -f fitcoin-ca.yaml
kubectl apply -f shop-ca.yaml
```

```
export FITCOIN_CA_POD=$(kubectl get pods -l app=fitcoin-ca -o jsonpath={.items..metadata.name})
export SHOP_CA_POD=$(kubectl get pods -l app=shop-ca -o jsonpath={.items..metadata.name})

kubectl cp ../containers/blockchain/fitcoinCertificateAuthority/ca $FITCOIN_CA_POD:/ca/
kubectl cp ../containers/blockchain/fitcoinCertificateAuthority/tls $FITCOIN_CA_POD:/ca/
kubectl cp ../containers/blockchain/fitcoinCertificateAuthority/fabric-ca-server-config.yaml $FITCOIN_CA_POD:/ca/fabric-ca-server-config.yaml

kubectl cp ../containers/blockchain/shopCertificateAuthority/ca $SHOP_CA_POD:/ca/
kubectl cp ../containers/blockchain/shopCertificateAuthority/tls $SHOP_CA_POD:/ca/
kubectl cp ../containers/blockchain/shopCertificateAuthority/fabric-ca-server-config.yaml $SHOP_CA_POD:/ca/fabric-ca-server-config.yaml

kubectl exec -ti $FITCOIN_CA_POD -- touch /ca/bootstrapped
kubectl exec -ti $SHOP_CA_POD -- touch /ca/bootstrapped
```
> try kubectl cp /tmp/foo_dir <some-pod>:/tmp/bar_dir

```
kubectl apply -f ca-datastore.yaml
kubectl apply -f fitcoin-statedb.yaml
kubectl apply -f shop-statedb.yaml
```

```
kubectl apply -f orderer0.yaml
kubectl apply -f shop-peer.yaml
kubectl apply -f fitcoin-peer.yaml

export ORDERER_POD=$(kubectl get pods -l app=orderer0 -o jsonpath={.items..metadata.name})
kubectl cp ../containers/blockchain/orderer/crypto $ORDERER_POD:/orderer/
kubectl exec -ti $ORDERER_POD -- touch /orderer/bootstrapped


export SHOP_PEER_POD=$(kubectl get pods -l app=shop-peer -o jsonpath={.items..metadata.name})
export FITCOIN_PEER_POD=$(kubectl get pods -l app=fitcoin-peer -o jsonpath={.items..metadata.name})

kubectl cp ../containers/blockchain/shopPeer/crypto $SHOP_PEER_POD:/peer/
kubectl cp ../containers/blockchain/fitcoinPeer/crypto $FITCOIN_PEER_POD:/peer/

kubectl exec -ti $SHOP_PEER_POD -- touch /peer/bootstrapped
kubectl exec -ti $FITCOIN_PEER_POD -- touch /peer/bootstrapped
```

```
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' blockchain-setup.yaml | kubectl apply -f -
```

```
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' shop-backend.yaml | kubectl apply -f -
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' fitcoin-backend.yaml | kubectl apply -f -
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' ingress-shop.yaml | kubectl apply -f -
```

```
cd containers/

docker build -t $DOCKERHUB_USERNAME/leaderboard:$DOCKER_TAGS leaderboard/
docker build -t $DOCKERHUB_USERNAME/mobile-assets:$DOCKER_TAGS mobile-assets/
docker build -t $DOCKERHUB_USERNAME/registeree-api:$DOCKER_TAGS registeree-api/

docker push $DOCKERHUB_USERNAME/leaderboard:$DOCKER_TAGS
docker push $DOCKERHUB_USERNAME/mobile-assets:$DOCKER_TAGS
docker push $DOCKERHUB_USERNAME/registeree-api:$DOCKER_TAGS
```

```
kubectl apply -f leaderboard.yaml
kubectl apply -f mobile-assets.yaml
kubectl apply -f registeree.yaml
```

```
kubectl apply -f ingress-prod.yaml
```
