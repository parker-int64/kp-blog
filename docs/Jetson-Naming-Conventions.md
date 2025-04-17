---
Jetson: Naming Conventions
---

<script setup>
import { ref, watch } from 'vue'

const cBoardName = ref("") // carrier board name
const cBoardRev = ref("") // carrier board revision
const selectedModule = ref("") // selected jetson module, this is usually fixed
const cSuffix = ref("") // different suffix in configuration file naming
const pSuffix = ref("") // processed the suffix, adding '-' at start of string
const productName = ref("")

watch(cSuffix, (newValue) => {
  if (newValue !== "" ) {
    pSuffix.value = `-${newValue}`
  }
})

</script>


# Jetson Naming Convention

+ Refer to nvidia's [Jetson Linux Developer Guide](https://docs.nvidia.com/jetson/archives/r36.4/DeveloperGuide/)

+ [Jetson EEPROM Layout](https://docs.nvidia.com/jetson/archives/r36.4/DeveloperGuide/HR/JetsonEepromLayout.html#hr-jetsoneepromlayout)

## Jetson Module

As suggested above, the naming table for official Jetson Module:

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">Product name</th>
      <th scope="col" class="px-6 py-3">Module ID</th>
      <th scope="col" class="px-6 py-3">Module SKU</th>
      <th scope="col" class="px-6 py-3">FAB</th>
      <th scope="col" class="px-6 py-3">Module Revision</th>
      <th scope="col" class="px-6 py-3">Chip SKU</th>
      </tr>
    </thead>
    <tbody>
      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
           Jetson Orin Nano 4GB 
        </th>
        <td class="px-6 py-4">p3767</td>
        <td class="px-6 py-4">0004</td>
        <td class="px-6 py-4">300</td>
        <td class="px-6 py-4">N.2</td>
        <td class="px-6 py-4 text-right">00:00:00:D6</td>
      </tr>
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          Jetson Orin Nano 8GB
      </th>
      <td class="px-6 py-4">p3767</td>
      <td class="px-6 py-4">0003</td>
      <td class="px-6 py-4">300</td>
      <td class="px-6 py-4">N.2</td>
      <td class="px-6 py-4 text-right">00:00:00:D6</td>
    </tr>
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          Jetson Orin NX 8GB
      </th>
      <td class="px-6 py-4">p3767</td>
      <td class="px-6 py-4">0001</td>
      <td class="px-6 py-4">300</td>
      <td class="px-6 py-4">M.3</td>
      <td class="px-6 py-4 text-right">00:00:00:D4</td>
    </tr>
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          Jetson Orin NX 16GB
      </th>
      <td class="px-6 py-4">p3767</td>
      <td class="px-6 py-4">0000</td>
      <td class="px-6 py-4">300</td>
      <td class="px-6 py-4">G.3</td>
      <td class="px-6 py-4 text-right">00:00:00:D3</td>
    </tr>    
    </tbody>
  </table>
</div>

## Jetson Carrier Boards & Modules

A typical configuration naming in a JetPack release looks like this


**jetson-`<Product Name>`-devkit[-industrial][-maxn|-qspi|-nvme].conf**


where:

- jetson-`<Product Name>`-devkit: Represent which jetson device.

- industrial: Industrial grade developer kit

- maxn: Enable MAXN mode by default.

- qspi: Flash the bootloader to internal QSPI and boot from it.

- nvme: Flash the bootloader to NVMe and boot from it.

These files are the symbolic links to actual configuration file:


**p`<Carrier Board ID>`-`<Carrier Board Revision>`-p`<Module ID>`-`<Module Revision>`[-a0][-maxn|-qspi|-nvme].conf**


where:

p`<Carrier Board ID>`-`<Board Revision>` is the modal of the carrier board, such as:

- p3737-0000: Carrier board for Jetson AGX Orin 

- p3768-0000: Carrier board for Jetson Orin Nano (Orin NX)

p`<Module ID>`-`<Module Revision>` refers to the Jetson Module's modal and revision:

- p3701-0000: AGX Orin 

- p3701-0008: AGX Orin Industrial

- p3767-0000: Orin NX 16GB

- p3767-0001: Orin NX 8GB

- p3767-0003: Orin Nano 8GB

- p3767-0004: Orin Nano 4GB

- a0: Hardware version (usually the first batch, for some specific versions).

- [maxn, qspi, nvme]: refer to previous definitions above.

### Generate Custom Carrier Board's Configurations

Select the name you preferred for your customize carrier boards.

+ Actual configuration.

<div class="flex items-center">
  <input 
    type="text" 
    id="boardName" 
    v-model="cBoardName" 
    class="w-28 h-9 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          block p-2 dark:bg-gray-700 dark:border-gray-600 
          dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
    placeholder="Carrier Board" 
    required />
  <p>-</p>
  <input 
    type="text" 
    id="boardRev" 
    v-model="cBoardRev" 
    class="w-24 h-9 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
    placeholder="Revision" 
    required />
  <p>-</p>
  <form>
    <select 
      id="modules" 
      v-model="selectedModule" 
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            block p-2 dark:bg-gray-700 
            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <option disabled value="">Jetson Module</option>
      <option value="p3767-0004">Orin Nano 4GB</option>
      <option value="p3767-0003">Orin Nano 8GB</option>
      <option value="p3767-0001">Orin NX 8GB</option>
      <option value="p3767-0000">Orin NX 16GB</option>
    </select>
  </form>
  <p>-</p>
  <input 
    type="text" 
    id="extra" 
    v-model="cSuffix" 
    class="w-16 h-9 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
    placeholder="Suffix" 
    required />
  <p>.conf</p>
</div>

Output:

```js-vue
{{ cBoardName }}-{{ cBoardRev }}-{{ selectedModule }}{{ pSuffix }}.conf
```
+ Preferred product name.

<input
  type="text"
  v-model="productName"
  class="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
         block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
         dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  placeholder="Enter your preferred product name"
  required
/>

Create the symbolic link:

```js-vue
ln -sf {{ cBoardName }}-{{ cBoardRev }}-{{ selectedModule }}{{ pSuffix }}.conf {{ productName }}.conf 
```

## Device Tree Overlay Naming