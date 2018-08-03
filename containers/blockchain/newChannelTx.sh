#!/bin/sh

CHANNEL_NAME=$EVENT_NAME
PROJPATH=$(pwd)

echo
echo "#################################################################"
echo "### Generating channel configuration transaction 'channel.tx' ###"
echo "#################################################################"
$PROJPATH/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx $PROJPATH/configuration/channel.tx -channelID $CHANNEL_NAME