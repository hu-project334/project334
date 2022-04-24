# project334

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Change Github Pages version

```
npm run build
git add dist -f
git commit -m "dist change"
git subtree push --prefix dist origin gh-pages
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Testing a Progressive web app (PWA)

```
- npm run preview
```

```
- npx http-server dist
```

- recommended checking Application > Service Workers > Update on reload [x] in chrome

## REQUIREMENTS FOR BLUETOOTH

Windows 10, de app werkt niet op Windows 11

HTTPS verbinding of localhost

Zorg ervoor dat `Experimental Web Platform features` in `about://flags`
