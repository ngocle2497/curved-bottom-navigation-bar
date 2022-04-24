package com.curvedbottomnavigationbar

import com.facebook.react.ReactPackage
import com.curvedbottomnavigationbar.RNShadow.RNShadowManager
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager


class CurvedBottomNavigationBarPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return emptyList()
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(RNShadowManager())
    }
}
