<script>
  import { parseFile } from './parser/parser.js'

  window.ondragover = event => {
    event.preventDefault()
  }
  window.ondrop = async event => {
    event.preventDefault()

    let file = event.dataTransfer.files.item(0)

    await parseFile(file)
  }
</script>
