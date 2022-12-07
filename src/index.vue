<template>
</template>
<script>
import { headerDOS } from './format/windows/header_dos.js'

export default {
  mounted() {
    window.ondragover = event => {
      event.preventDefault()
    }
    window.ondrop = async event => {
      event.preventDefault()

      let file = event.dataTransfer.files.item(0)

      let test1 = await headerDOS(file)
      console.log(test1)
    }
  }
}
</script>
<style scoped>
</style>
