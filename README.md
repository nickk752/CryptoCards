# CryptoCards
## CryptoCards is a trading card game build on an Ethereum Blockchain

# Installation instructions
## Dependencies
- MongoDB
- Ganache
- Python 2.7
- Node
- All the node packages in package.json
  - Express, Phaser, etc...

# Installation Instructions (Ubuntu)
- MongoDB
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5

echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list

sudo apt-get update

sudo apt-get install -y mongodb-org

systemctl start mongod
systemctl enable mongod
```
- Python
```
sudo apt install python2.7 python-pip
```
- Node
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash

sudo apt-get install -y nodejs

(to update npm)
sudo npm install npm --global
```
- Ganache
With Node installed:
```
npm install -g ganache-cli
```

# Build and Deployment Instruction
- In the main folder, and then in the game folder, do:
```
sudo npm install
```
then in the game folder, to start the game server do:
```
node server.js
```
and then in the main folder do:
```
node start
```
to start the main web-app

# Features
- CryptoCards allows users to view their cards in an inventory
- CryptoCards has a system to collect new cards
- CryptoCards allows users to play 1v1 duels with their cards
- CryptoCards supports the representation and interaction with 
these cards on an Ethereum blockchain

# Known Bugs
- Moves get sent when you cant make them
  - Sometimes in the game even if you can't make a move,
  and your local game doesn't let you (moves the card 
  back to your hand) it will still tell your opponent that
  you made the move
- Cards show up twice for your opponent
  - Sometimes when you play a machine in game, it will appear 
  in both of your opponents lanes.
- Server sometimes crashes when trying to interact with the
blockchain.