## Q1 Role de chaque fichier

### App.js
C'est le fichier principal de l'application. Il controle ce qu'on voit a l'ecran 
si on n'est pas encore connecte, il affiche la page de connexion (Join.js),
sinon il affiche le chat (Chat.js). Il garde aussi en memoire le nom d'utilisateur
et la room choisie.

### Chat.js
C'est la page principale du chat. C'est ici qu'on envoie et reçoit les messages
en temps reel avec Socket.io. Il affiche aussi la liste des participants (Sidebar)
et les bulles de messages (Message.js). Il scroll automatiquement vers le bas
quand un nouveau message arrive.

### Message.js
Ce composant affiche un seul message. Si le message vient de moi, la bulle
s'affiche a droite (classe "own"). Si ça vient de quelqu'un d'autre, elle
s'affiche à gauche (classe "other"). Il gere aussi les messages systeme comme
"Aboubacar a rejoint la room".

### Sidebar.js
C'est le panneau lateral qui montre la liste des personnes connectees dans
la room. Quand quelqu'un rejoint ou quitte, la liste se met a jour
automatiquement. Chaque utilisateur est affiche avec son initiale et un
point vert.

### Join.js
C'est la page de connexion. On entre notre pseudo, on choisit une room
existante ou on en cree une nouvelle. Une fois qu'on clique pour rejoindre,
l'application passe au composant Chat.js.

### server.js
C'est le serveur backend. Il gere toutes les connexions Socket.io et garde
en memoire les rooms et les utilisateurs connectes. Quand quelqu'un envoie
un message, c'est le serveur qui le retransmet à tous les membres de la room.

### SocketContext.js
Ce fichier cree la connexion Socket.io et la rend accessible a tous les
composants de l'application via un hook appele useSocket(). Le socket est
cree une seule fois pour eviter les bugs de connexions multiples.

---

## Q2 Communication frontend / backend

### Comment le socket est partage entre les composants
Le socket est cree dans SocketContext.js et "enveloppe" autour de toute
l'application. N'importe quel composant peut y acceder en appelant
useSocket(). C'est comme une variable globale, mais propre et securisee
avec le système de Context de React.

### Evenement emis quand on rejoint une room
Quand on clique pour rejoindre une room dans Join.js, le client envoie
l'evenement join_room au serveur avec le nom d'utilisateur et la room.
Le serveur reçoit ça, ajoute l'utilisateur a la room, et envoie un message
systeme e tout le monde pour dire que la personne a rejoint.

### Comment les messages sont diffusés (emit vs broadcast)
- io.to(room).emit() envoie le message à tous les membres de la room,
  incluant la personne qui a envoyé le message.
- socket.broadcast.to(room).emit() envoie à tout le monde sauf
  l'expediteur. Dans ce projet, on utilise io.to() pour que tout le monde
  reçoive le message en meme temps.