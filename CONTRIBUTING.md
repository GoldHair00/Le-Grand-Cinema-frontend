# Convention de nommage des branches

| Branche | Rôle | Exemple |
|---|---|---|
| main | Code stable, déployé en production | main |
| develop | Intégration des fonctionnalités | develop |
| feature/<nom> | Nouvelle user story | feature/seat-map |
| fix/<nom> | Correction de bug | fix/seat-colors |
| release/<nom> | Préparation d'une livraison | release/1.0 |
| hotfix/<nom> | Correction urgente depuis main | hotfix/api-url |
| docs/<nom> | Documentation | docs/readme |

Règles : minuscules, mots séparés par des tirets, nom court et explicite, en anglais.

Flux : feature/* → pull request vers develop → develop vers main à chaque livraison.

# Convention de commits

| Préfixe | Usage |
|---|---|
| feat: | nouvelle fonctionnalité |
| fix: | correction de bug |
| docs: | documentation |
| test: | tests |
| chore: | maintenance |
