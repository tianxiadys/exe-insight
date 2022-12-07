<template>
</template>
<script>
import HeaderDOS from './format/windows/header_dos.js'

export default {
  mounted() {
    window.ondragover = event => {
      event.preventDefault()
    }
    window.ondrop = async event => {
      event.preventDefault()

      let file = event.dataTransfer.files.item(0)

      let test1 = await HeaderDOS(file)
      console.log(test1)
    }
  }
}
</script>
<style scoped>
</style>
