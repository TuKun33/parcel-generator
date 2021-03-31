import $route from '../mixins/route'
import { production } from '../ENV'

try {
  if ($route.computed.$route().query.console) {
    const consoleScript = document.createElement('script')
    consoleScript.src = `${production().SCOPE}/vconsole.min.js`
    document.head.appendChild(consoleScript)
    consoleScript.onload = () => {
      window.vconsole = new VConsole()
      setTimeout(_ => {
        window.vconsole.show()
      }, 4000)
    }
  }
} catch(e) {}