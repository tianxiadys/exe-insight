<template>
</template>
<script>
import HeaderDOS from './format/windows/header_dos'

export default {
  mounted() {
    window.ondragover = event => {
      event.preventDefault()
    }
    window.ondrop = async event => {
      event.preventDefault()

      let file = event.dataTransfer.files.item(0)

      let test = await HeaderDOS(file)

      console.log(test)
      window.a = test
    }
  }
}
</script>
<style scoped>
</style>
