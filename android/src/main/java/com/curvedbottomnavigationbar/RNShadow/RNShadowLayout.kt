package com.curvedbottomnavigationbar.RNShadow

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.*
import android.util.Log
import android.view.View
import android.view.ViewParent
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.views.view.ReactViewGroup
import kotlin.math.roundToInt


class RNShadowLayout(context: Context?) : ReactViewGroup(context) {
  var listener: RNShadowListener? = null
  private var mColor = 0
  private var mRadius = 0f
  private var mOpacity = 0f
  private var dX = 0f
  private var dY = 0f
  private var cX = 0f
  private var cY = 0f
  private var shadow = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)
  private var content = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)
  private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
  private val blur = Paint(Paint.ANTI_ALIAS_FLAG)
  private val draw = Canvas(content)
  private var contentDirty = false
  private var shadowDirty = false
  private var hasContent = false
  private var hasOpacity = false
  private var hasRadius = false
  private var hasColor = false
  private var hasArea = false
  fun setShadowOffset(map: ReadableMap?) {
    val hasMap = map != null
    dX = if (hasMap && map!!.hasKey("width")) {
      map.getDouble("width").toFloat()
    } else {
      0f
    }
    dY = if (hasMap && map!!.hasKey("height")) {
      map.getDouble("height").toFloat()
    } else {
      0f
    }
    dX *= this.context.resources.displayMetrics.density
    dY *= this.context.resources.displayMetrics.density
    super.invalidate()
  }

  fun setShadowColor(color: Int) {
    hasColor = color != null
    if (hasColor && mColor != color) {
      paint.color = color
      paint.alpha = (255 * mOpacity).roundToInt()
      mColor = color
    }
    super.invalidate()
  }

  fun setShadowOpacity(Opacity: Dynamic?) {
    hasOpacity = Opacity != null && !Opacity.isNull
    val opacity = if (hasOpacity) Opacity!!.asDouble().toFloat() else 0f
    hasOpacity = hasOpacity and (opacity > 0f)
    if (hasOpacity && mOpacity != opacity) {
      paint.color = mColor
      paint.alpha = (255 * opacity).roundToInt()
      mOpacity = opacity
    }
    super.invalidate()
  }

  fun setShadowRadius(Radius: Dynamic?) {
    hasRadius = Radius != null && !Radius.isNull
    val rawRadius = if (hasRadius) Radius!!.asDouble().toFloat() else 0f
    val radius = rawRadius * 2 * this.context.resources.displayMetrics.density
    hasRadius = hasRadius and (radius > 0f)
    if (hasRadius && mRadius != radius) {
      blur.maskFilter = BlurMaskFilter(radius, BlurMaskFilter.Blur.NORMAL)
      mRadius = radius
      shadowDirty = true
    }
    super.invalidate()
  }

  override fun invalidateChildInParent(location: IntArray, dirty: Rect): ViewParent? {
    contentDirty = true
    shadowDirty = true

    super.invalidateChildInParent(location, dirty)
    super.invalidate()
    return null
  }

  override fun onDescendantInvalidated(child: View, target: View) {
    contentDirty = true
    shadowDirty = true
    super.onDescendantInvalidated(child, target)
    super.invalidate() //Gives better effect on touchableopacity etc.
  }

  override fun invalidate() {
    contentDirty = true
    shadowDirty = true
    super.invalidate()
  }

  @SuppressLint("DrawAllocation")
  override fun onMeasure(widthSpec: Int, heightSpec: Int) {
    val height = MeasureSpec.getSize(heightSpec)
    val width = MeasureSpec.getSize(widthSpec)
    setMeasuredDimension(width, height)
    hasArea = width > 0 && height > 0
    if (hasArea) {
      if (content.width == width && content.height == height) {
        return
      }
      content.recycle()
      hasContent = false
      content = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
      draw.setBitmap(content)
    }
    invalidate()
  }

  public override fun dispatchDraw(canvas: Canvas) {
    if (hasArea) {
      if (contentDirty) {
        if (hasContent) {
          content.eraseColor(Color.TRANSPARENT)
        }
        super.dispatchDraw(draw)
        contentDirty = false
        hasContent = true
      }
      if (hasColor && hasOpacity) {
        if (shadowDirty) {
          shadow.recycle()
          shadow = content.extractAlpha(blur, null)
          shadowDirty = false
        }
        cX = dX - (shadow.width - content.width) / 2
        cY = dY - (shadow.height - content.height) / 2
        canvas.drawBitmap(shadow, cX, cY, paint)
      }
      canvas.drawBitmap(content, 0f, 0f, null)
    }
    super.dispatchDraw(canvas)
  }
}
