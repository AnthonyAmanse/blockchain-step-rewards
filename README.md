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

kubectl create secret generic secret-files-${EVENT_NAME} --from-file=config.json=configuration/config.json --from-file=channel.tx=configuration/channel.tx
```

```
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' fitcoin-ca.yaml | kubectl apply -f -
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' shop-ca.yaml | kubectl apply -f -
```

```
export FITCOIN_CA_POD=$(kubectl get pods -l app=fitcoin-ca,event=${EVENT_NAME} -o jsonpath={.items..metadata.name})
export SHOP_CA_POD=$(kubectl get pods -l app=shop-ca,event=${EVENT_NAME} -o jsonpath={.items..metadata.name})

kubectl cp ../containers/blockchain/fitcoinCertificateAuthority/ca $FITCOIN_CA_POD:/ca/
kubectl cp ../containers/blockchain/fitcoinCertificateAuthority/tls $FITCOIN_CA_POD:/ca/
kubectl cp ../containers/blockchain/fitcoinCertificateAuthority/fabric-ca-server-config.yaml $FITCOIN_CA_POD:/ca/fabric-ca-server-config.yaml

kubectl cp ../containers/blockchain/shopCertificateAuthority/ca $SHOP_CA_POD:/ca/
kubectl cp ../containers/blockchain/shopCertificateAuthority/tls $SHOP_CA_POD:/ca/
kubectl cp ../containers/blockchain/shopCertificateAuthority/fabric-ca-server-config.yaml $SHOP_CA_POD:/ca/fabric-ca-server-config.yaml

kubectl exec -ti $FITCOIN_CA_POD -- touch /ca/bootstrapped
kubectl exec -ti $SHOP_CA_POD -- touch /ca/bootstrapped
```

kubectl apply -f ca-datastore.yaml
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' fitcoin-statedb.yaml | kubectl apply -f -
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' shop-statedb.yaml | kubectl apply -f -


sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' orderer0.yaml | kubectl apply -f -

export ORDERER_POD=$(kubectl get pods -l app=orderer0,event=${EVENT_NAME} -o jsonpath={.items..metadata.name})
kubectl cp ../containers/blockchain/orderer/crypto $ORDERER_POD:/orderer/
kubectl exec -ti $ORDERER_POD -- touch /orderer/bootstrapped


sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' shop-peer.yaml | kubectl apply -f -
export SHOP_PEER_POD=$(kubectl get pods -l app=shop-peer,event=${EVENT_NAME} -o jsonpath={.items..metadata.name})
kubectl cp ../containers/blockchain/shopPeer/crypto $SHOP_PEER_POD:/peer/

sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' fitcoin-peer.yaml | kubectl apply -f -
export FITCOIN_PEER_POD=$(kubectl get pods -l app=fitcoin-peer,event=${EVENT_NAME} -o jsonpath={.items..metadata.name})
kubectl cp ../containers/blockchain/fitcoinPeer/crypto $FITCOIN_PEER_POD:/peer/


kubectl exec -ti $SHOP_PEER_POD -- touch /peer/bootstrapped
kubectl exec -ti $FITCOIN_PEER_POD -- touch /peer/bootstrapped

sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' blockchain-setup.yaml | kubectl apply -f -

> This throws error at creating sample user

sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' shop-backend.yaml | kubectl apply -f -
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' fitcoin-backend.yaml | kubectl apply -f -
sed -e 's#{{ EVENT_NAME }}#'${EVENT_NAME}'#g' rabbitclient-api.yaml | kubectl apply -f -