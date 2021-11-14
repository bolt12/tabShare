# TabShare

Share your Google Chrome Tabs easily.

## Description

Want to share a bunch of links with someone and don't want to paste them one by one in a
text file? Want someone to share a bunch of links with you and don't want to manually
open them one by one in new tabs?

If you are reading this then surely you found yourself looking either for gifts or
choosing between many different options and keeping tabs open only to tediously share it
with someone.

If you were looking for a solution, now you can with Google Chrome's new extension: TabShare !

### File Format

JSON file format:

```json
{
  "groups": [
    "name": String,
    "tabs": [ String ]
    ]
}
```

Se o nome do grupo for vazio ou nao existir abre sem grupo.

## TODOs

- [x] Tem que importar um ficheirinho com as tabs para abrir
- [x] Tem que as abrir
- [x] Tratar dos erros
- [x] Sanitizar o input
- [x] Gerar o ficheiro localmente
  - [x] Detetar tabs selecionadas
  - [x] Gerar JSON String
  - [x] Download do ficheiro
- [x] Por butao mais fancy
- [] Por a funcionar com os grupos
  - [x] Gerar
  - [x] Parsing
  - [x] Loading
  - [] Para partilhar um grupo ja feito adicionar um dropdown com todos os grupos da
      sessao e escolher os grupos para partilhar
      (NOTA: Selecionar tabs num grupo nao preserva o grupo)
- Corrigir query (varias sessoes abertas)

- [] Nao fazer logo o download e mostrar o texto(output) para
    copy paste e um sitio para poder escolher o nome do ficheiro
- [] Em vez de ficheiro usar um encoded token
- [] Mostrar output na UI
- [] Ter text box para carregar as tabs
- [] Meter os grupos ao barulho

