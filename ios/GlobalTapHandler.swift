import UIKit

@objc class GlobalTapHandler: NSObject, UIGestureRecognizerDelegate {
  private var gestureRecognizer: UITapGestureRecognizer?
var onTap: ((_ location: CGPoint, _ isTextInput: Bool, _ viewClass: String) -> Void)?

  func attach(to view: UIView) {
    guard gestureRecognizer == nil else { return }

    let recognizer = UITapGestureRecognizer(target: self, action: #selector(handleTap(_:)))
    recognizer.delegate = self
    recognizer.cancelsTouchesInView = false
    recognizer.delaysTouchesEnded = false
    recognizer.requiresExclusiveTouchType = false
    
    view.addGestureRecognizer(recognizer)
    gestureRecognizer = recognizer
  }
    
  func detach() {
    if let gesture = self.gestureRecognizer {
      gesture.view?.removeGestureRecognizer(gesture)
      self.gestureRecognizer = nil
    }
    self.onTap = nil
  }

  @objc private func handleTap(_ recognizer: UITapGestureRecognizer) {
    guard let rootView = recognizer.view else { return }

    let location = recognizer.location(in: rootView)
    if let hitView = rootView.hitTest(location, with: nil) {
      let isTextInput = isViewTextInput(hitView)
      let viewClassName = NSStringFromClass(type(of: hitView))
      onTap?(location, isTextInput, viewClassName)
    }
  }

  private func isViewTextInput(_ view: UIView) -> Bool {
    if view is UITextField || view is UITextView {
      return true
    }

    // Check for RCTTextInput specifically
    if NSStringFromClass(type(of: view)).contains("RCTTextInput") {
      return true
    }
    
    // find the parent view that is a text input
    var superview = view.superview
    while let current = superview {
      if current is UITextField || current is UITextView || NSStringFromClass(type(of: current)).contains("RCTTextInput") {
        return true
      }
      superview = current.superview
    }
    return false
  }

  // allow other gesture recognizers to work simultaneously
  func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
    return true
  }

  // always allow receiving events
  func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
    return true
  }
}
