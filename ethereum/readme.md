### Run Blockchain in dev mode
```bash
geth -http --http.corsdomain "http://localhost:3030,https://remix.ethereum.org" --http.api "personal,eth,net,web3,txpool,miner,admin" --vmdebug --datadir blockchain --dev console
```
