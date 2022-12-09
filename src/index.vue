<template>
</template>
<script>
import WindowsImage from './format/windows/image.js'

export default {
  mounted() {
    window.ondragover = event => {
      event.preventDefault()
    }
    window.ondrop = async event => {
      event.preventDefault()

      let file = event.dataTransfer.files.item(0)

      let test1 = new WindowsImage(file)
      await test1.parse()
      console.log(test1)
    }
  }
}
</script>
<style scoped>
</style>
