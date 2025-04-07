import ExpoModulesCore
import UIKit

public class ExpoClickOutsideModule: Module {
  private let tapHandler = GlobalTapHandler()

  public func definition() -> ModuleDefinition {
    Name("ExpoClickOutside")

    Events("onTap")

    OnStartObserving {
      DispatchQueue.main.async {
        guard let window = UIApplication.shared.connectedScenes
          .compactMap({ $0 as? UIWindowScene })
          .flatMap({ $0.windows })
          .first(where: { $0.isKeyWindow }) else {
            print("ExpoClickOutsideModule: No active key window found")
            return
          }

        self.tapHandler.attach(to: window)
          self.tapHandler.onTap = { point, isTextInput, viewClass in
          self.sendEvent("onTap", [
            "x": point.x,
            "y": point.y,
            "targetIsTextInput": isTextInput,
            "target": viewClass
          ])
        }
      }
    }

    OnStopObserving {
       self.tapHandler.detach()
    }
  }
}
