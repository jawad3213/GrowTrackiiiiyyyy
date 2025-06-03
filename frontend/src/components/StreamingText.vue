<template>
  <div ref="textRef" class="max-w-[60rem] py-0 mx-auto text-center text-lg">
    <p class="transform-gpu" :class="textClass" ref="textTarget"></p>
  </div>
</template>

<script>
import { onMounted, ref, watch, nextTick } from 'vue'
import gsap from 'gsap'

export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    textClass: {
      type: String,
      default: ''
    },
    fromVars: {
      type: Object,
      default: () => ({})
    },
    toVars: {
      type: Object,
      default: () => ({})
    },
    splittingBy: {
      type: String,
      default: 'words' // or 'chars'
    }
  },
  setup(props) {
    const textTarget = ref(null)

    const splitText = () => {
      if (!textTarget.value) return

      // Clear any existing content
      textTarget.value.innerHTML = ''

      if (props.splittingBy === 'words') {
        const words = props.text.split(' ')
        words.forEach((word, i) => {
          const span = document.createElement('span')
          span.textContent = word + ' '
          span.style.display = 'inline-block'
          span.style.whiteSpace = 'pre'
          textTarget.value.appendChild(span)
        })
      } else if (props.splittingBy === 'chars') {
        [...props.text].forEach(char => {
          const span = document.createElement('span')
          span.textContent = char
          span.style.display = 'inline-block'
          textTarget.value.appendChild(span)
        })
      }
    }

    const animate = () => {
      const targets = textTarget.value?.children
      if (targets?.length) {
        gsap.fromTo(targets, props.fromVars, props.toVars)
      }
    }

    onMounted(async () => {
      await nextTick()
      splitText()
      animate()
    })

    watch(() => props.text, async () => {
      await nextTick()
      splitText()
      animate()
    })

    return {
      textTarget
    }
  }
}
</script>
