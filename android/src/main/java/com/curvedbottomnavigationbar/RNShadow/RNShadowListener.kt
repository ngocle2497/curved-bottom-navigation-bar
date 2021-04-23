package com.curvedbottomnavigationbar.RNShadow

import android.os.CountDownTimer
import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.uimanager.events.EventDispatcherListener
import com.facebook.react.views.image.ReactImageView
import com.facebook.react.views.view.ReactViewGroup
import java.util.*

class RNShadowListener(private val reactContext: ReactContext) : EventDispatcherListener {
  private val imageIds: MutableMap<Int, RNShadowLayout?> = HashMap()
  private val viewsToFadeIn: MutableList<RNShadowLayout?> = ArrayList()
  private val eventDispatcher: EventDispatcher
  private var fadeTimer: CountDownTimer? = null
  fun onAddView(parent: RNShadowLayout?, child: View) {
    if (child is ReactImageView) {
      child.setShouldNotifyLoadEvents(true)
      imageIds[child.getId()] = parent
    } else if (child is ReactViewGroup) {
      for (index in 0 until (child as ViewGroup).childCount) {
        val nextChild = (child as ViewGroup).getChildAt(index)
        onAddView(parent, nextChild)
      }
    }
  }

  override fun onEventDispatch(event: Event<*>) {
    // Events can be dispatched from any thread so we have to make sure handleEvent is run from the
    // UI thread.
    if (UiThreadUtil.isOnUiThread()) {
      handleEvent(event)
    } else {
      UiThreadUtil.runOnUiThread { handleEvent(event) }
    }
  }

  private fun handleEvent(event: Event<*>) {
    //Make sure it only redraws on image events in current view
    if (event.eventName === "topLoadEnd" && imageIds.containsKey(event.viewTag)) {
      val shadowLayout = imageIds[event.viewTag]
      viewsToFadeIn.add(shadowLayout)
      if (fadeTimer != null) {
        fadeTimer!!.cancel()
      }
      fadeTimer = object : CountDownTimer(500, 33) {
        override fun onTick(millisUntilFinished: Long) {
          for (view in viewsToFadeIn) {
            view!!.invalidate()
          }
        }

        override fun onFinish() {
          for (view in viewsToFadeIn) {
            view!!.invalidate()
          }
          viewsToFadeIn.clear()
        }
      }.start()
    }
  }

  fun tearDown() {
    eventDispatcher.removeListener(this)
  }

  init {
    eventDispatcher = reactContext.getNativeModule(UIManagerModule::class.java)!!.eventDispatcher
    eventDispatcher?.addListener(this)
  }
}
