package expo.modules.clickoutside

import android.app.Activity
import android.view.MotionEvent
import android.view.Window
import android.widget.EditText
import android.util.DisplayMetrics
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class GlobalTapHandler(
  private val onTap: (x: Float, y: Float, isTextInput: Boolean, target: String?) -> Unit
) {
  private var originalCallback: Window.Callback? = null

  fun attach(activity: Activity) {
    val window = activity.window
    originalCallback = window.callback
    
    window.callback = object : Window.Callback {
      // Forward all methods to the original callback
      override fun dispatchKeyEvent(event: android.view.KeyEvent): Boolean {
        return originalCallback?.dispatchKeyEvent(event) ?: false
      }
  
      override fun dispatchKeyShortcutEvent(event: android.view.KeyEvent): Boolean {
        return originalCallback?.dispatchKeyShortcutEvent(event) ?: false
      }
  
      override fun dispatchTouchEvent(event: MotionEvent): Boolean {
        if (event.action == MotionEvent.ACTION_DOWN) {
          // 获取原始像素坐标
          val rawX = event.rawX
          val rawY = event.rawY
          
          // 获取当前屏幕信息
          val metrics = activity.resources.displayMetrics
          val density = metrics.density  // 获取当前设备的密度因子
          val screenWidth = metrics.widthPixels
          val screenHeight = metrics.heightPixels
          
          // 获取窗口装饰视图信息
          val decorView = activity.window.decorView
          val decorWidth = decorView.width
          val decorHeight = decorView.height
          
          // 获取实际内容区域
          val contentRect = android.graphics.Rect()
          decorView.getWindowVisibleDisplayFrame(contentRect)
          
          // 记录基本屏幕信息
          android.util.Log.d("GlobalTapHandler", "Screen info: screen=${screenWidth}x${screenHeight}, decor=${decorWidth}x${decorHeight}, content=${contentRect.toShortString()}")
          android.util.Log.d("GlobalTapHandler", "Raw touch at rawX: $rawX, rawY: $rawY")
          
          // 识别显示模式
          val hasNegativeTop = contentRect.top < 0
          val isSecondaryDisplay = hasNegativeTop // 副屏的主要特征是内容区域top为负值
          val isSplitScreen = !isSecondaryDisplay && (decorWidth < screenWidth * 0.9 || decorHeight < screenHeight * 0.9)
          val isNormalMode = !isSecondaryDisplay && !isSplitScreen
          
          android.util.Log.d("GlobalTapHandler", "Display mode: isNormalMode=$isNormalMode, isSplitScreen=$isSplitScreen, isSecondaryDisplay=$isSecondaryDisplay")
          
          // 计算DP坐标 - 基于不同的显示模式采用不同策略
          var dpX = 0f
          var dpY = 0f
            
          dpX = rawX / density
          dpY = rawY / density
          
          // 输出计算结果
          android.util.Log.d("GlobalTapHandler", "Final coordinates (all valid): dpX: $dpX, dpY: $dpY")
          
          val view = activity.currentFocus
          val isTextInput = view is EditText
          val viewClass = view?.javaClass?.simpleName
  
          // 使用转换后的坐标
          onTap(dpX, dpY, isTextInput, viewClass)
        }
  
        return originalCallback?.dispatchTouchEvent(event) ?: false
      }
  
      override fun dispatchTrackballEvent(event: MotionEvent): Boolean {
        return originalCallback?.dispatchTrackballEvent(event) ?: false
      }
  
      override fun dispatchGenericMotionEvent(event: MotionEvent): Boolean {
        return originalCallback?.dispatchGenericMotionEvent(event) ?: false
      }
  
      override fun dispatchPopulateAccessibilityEvent(event: android.view.accessibility.AccessibilityEvent): Boolean {
        return originalCallback?.dispatchPopulateAccessibilityEvent(event) ?: false
      }
  
      override fun onCreatePanelView(featureId: Int): android.view.View? {
        return originalCallback?.onCreatePanelView(featureId)
      }
  
      override fun onCreatePanelMenu(featureId: Int, menu: android.view.Menu): Boolean {
        return originalCallback?.onCreatePanelMenu(featureId, menu) ?: false
      }
  
      override fun onPreparePanel(featureId: Int, view: android.view.View?, menu: android.view.Menu): Boolean {
        return originalCallback?.onPreparePanel(featureId, view, menu) ?: false
      }
  
      override fun onMenuOpened(featureId: Int, menu: android.view.Menu): Boolean {
        return originalCallback?.onMenuOpened(featureId, menu) ?: false
      }
  
      override fun onMenuItemSelected(featureId: Int, item: android.view.MenuItem): Boolean {
        return originalCallback?.onMenuItemSelected(featureId, item) ?: false
      }
  
      override fun onWindowAttributesChanged(attrs: android.view.WindowManager.LayoutParams) {
        originalCallback?.onWindowAttributesChanged(attrs)
      }
  
      override fun onContentChanged() {
        originalCallback?.onContentChanged()
      }
  
      override fun onWindowFocusChanged(hasFocus: Boolean) {
        originalCallback?.onWindowFocusChanged(hasFocus)
      }
  
      override fun onAttachedToWindow() {
        originalCallback?.onAttachedToWindow()
      }
  
      override fun onDetachedFromWindow() {
        originalCallback?.onDetachedFromWindow()
      }
  
      override fun onPanelClosed(featureId: Int, menu: android.view.Menu) {
        originalCallback?.onPanelClosed(featureId, menu)
      }
  
      override fun onSearchRequested(): Boolean {
        return originalCallback?.onSearchRequested() ?: false
      }
  
      override fun onSearchRequested(searchEvent: android.view.SearchEvent): Boolean {
        return originalCallback?.onSearchRequested(searchEvent) ?: false
      }
  
      override fun onWindowStartingActionMode(callback: android.view.ActionMode.Callback): android.view.ActionMode? {
        return originalCallback?.onWindowStartingActionMode(callback)
      }
  
      override fun onWindowStartingActionMode(callback: android.view.ActionMode.Callback, type: Int): android.view.ActionMode? {
        return originalCallback?.onWindowStartingActionMode(callback, type)
      }
  
      override fun onActionModeStarted(mode: android.view.ActionMode) {
        originalCallback?.onActionModeStarted(mode)
      }
  
      override fun onActionModeFinished(mode: android.view.ActionMode) {
        originalCallback?.onActionModeFinished(mode)
      }
    }
  }

  fun detach(activity: Activity) {
    val window = activity.window
    if (originalCallback != null) {
      window.callback = originalCallback
      originalCallback = null
    }
  }
}