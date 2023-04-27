<template>
</template>
<script>
import { ParserPE } from './format/pe/pe.js'
import { ParserELF } from './format/elf/elf.js'

export default {
    mounted() {
        window.ondragover = event => {
            event.preventDefault()
        }
        window.ondrop = async event => {
            event.preventDefault()

            let file = event.dataTransfer.files.item(0)
            let test1 = new ParserELF()
            await test1.parse(file)
            console.log(test1)
        }
    }
}
</script>
<style scoped>
table {
    border: 1px solid gray;
    text-align: left;
}
</style>
