package com.curvedbottomnavigationbar.RNShadow

import android.util.Log
import android.view.View
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

class RNShadowManager : ViewGroupManager<RNShadowLayout>() {
  var listener: RNShadowListener? = null
  override fun createViewInstance(reactContext: ThemedReactContext): RNShadowLayout {
    val shadowLayout = RNShadowLayout(reactContext)
    if (listener == null) { //One listener for all views
      listener = RNShadowListener(reactContext)
    }
    shadowLayout.setLayerType(View.LAYER_TYPE_SOFTWARE,null)
    return shadowLayout
  }

  override fun getName(): String {
    return REACT_CLASS
  }

  @ReactProp(name = "shadowOffset")
  fun setShadowOffset(view: RNShadowLayout, offsetMap: ReadableMap?) {

    view.setShadowOffset(offsetMap)
  }

  @ReactProp(name = "shadowColor")
  fun setShadowColor(view: RNShadowLayout, color: Int?) {
    view.setShadowColor(color!!)
  }

  @ReactProp(name = "shadowOpacity")
  fun setShadowOpacity(view: RNShadowLayout, opacity: Dynamic?) {
    view.setShadowOpacity(opacity)
  }

  @ReactProp(name = "shadowRadius")
  fun setShadowRadius(view: RNShadowLayout, radius: Dynamic?) {
    view.setShadowRadius(radius)
  }

  override fun addView(parent: RNShadowLayout, child: View, index: Int) {
    listener!!.onAddView(parent, child)
    super.addView(parent, child, index)
  }

  override fun onDropViewInstance(parent: RNShadowLayout) {
    listener!!.tearDown()
  }

  companion object {
    const val REACT_CLASS = "RNShadow"
  }
}
