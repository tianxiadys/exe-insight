<template>
  <div v-if="image">
    <div v-if="image.EXPORT">
      <h2>EXPORT</h2>
      <table>
        <tr v-for="item of image.EXPORT.RESULT">
          <th>{{ item.Index }}</th>
          <th>{{ item.Address }}</th>
          <th>{{ item.Name }}</th>
        </tr>
      </table>
    </div>
    <div v-if="image.IMPORT">
      <h2>IMPORT</h2>
      <table>
        <tr v-for="item of image.IMPORT">
          <th>{{ item.NameString }}</th>
          <th>
            <table>
              <tr v-for="item2 of item.RESULT">
                <th>{{ item2.Index }}</th>
                <th>{{ item2.Ordinal }}</th>
                <th>{{ item2.Name }}</th>
              </tr>
            </table>
          </th>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import WindowsImage from './format/windows/image.js'

export default {
  data() {
    return {
      image: null
    }
  },
  mounted() {
    window.ondragover = event => {
      event.preventDefault()
    }
    window.ondrop = async event => {
      event.preventDefault()

      let file = event.dataTransfer.files.item(0)

      let test1 = new WindowsImage(file)
      await test1.parse()
      this.image = test1
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
