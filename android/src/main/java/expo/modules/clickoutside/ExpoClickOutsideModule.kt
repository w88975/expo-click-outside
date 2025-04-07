package expo.modules.clickoutside

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoClickOutsideModule : Module() {
  private var tapHandler: GlobalTapHandler? = null

  override fun definition() = ModuleDefinition {
    Name("ExpoClickOutside")

    Events("onTap")

    OnStartObserving {
      val activity = appContext.currentActivity ?: return@OnStartObserving

      tapHandler = GlobalTapHandler { x, y, isTextInput, viewClass ->
        sendEvent("onTap", mapOf(
          "x" to x,
          "y" to y,
          "targetIsTextInput" to isTextInput,
          "target" to viewClass
        ))
      }

      tapHandler?.attach(activity)
    }

    OnStopObserving {
      val activity = appContext.currentActivity ?: return@OnStopObserving
      tapHandler?.detach(activity)
      tapHandler = null
    }
  }
}
